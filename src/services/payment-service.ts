
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types";

export interface PaymentSessionRequest {
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
  customerEmail?: string;
  shippingInfo?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  successUrl: string;
  cancelUrl: string;
  orderTotal: number;
  deliveryPrice: number;
}

export interface PaymentSessionResponse {
  sessionId: string;
  checkoutUrl: string;
}

export interface ProcessPaymentRequest {
  sessionId: string;
  userId?: string;
}

// Set pour stocker les sessions déjà traitées afin d'éviter les doublons
const processedSessions = new Set<string>();

export async function createPaymentSession(request: PaymentSessionRequest): Promise<PaymentSessionResponse> {
  try {
    console.log("Sending payment session request:", JSON.stringify(request));
    const { data, error } = await supabase.functions.invoke<PaymentSessionResponse>(
      'create-payment-session',
      {
        body: request,
      }
    );

    if (error) {
      console.error('Error creating payment session:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from payment session creation');
    }

    console.log("Payment session created successfully:", data);
    return data;
  } catch (error) {
    console.error('Error in payment service:', error);
    throw error;
  }
}

export async function processPaymentSuccess(sessionId: string, userId?: string): Promise<{ orderId: string }> {
  try {
    console.log("Processing payment success for session ID:", sessionId);
    console.log("User ID:", userId || "Anonymous user");
    
    // Si cette session a déjà été traitée, retourner immédiatement pour éviter les doublons
    if (processedSessions.has(sessionId)) {
      console.log("Session already processed, skipping duplicate request:", sessionId);
      return { orderId: "already-processed" };
    }
    
    // Marquer cette session comme étant en cours de traitement
    processedSessions.add(sessionId);
    
    const { data, error } = await supabase.functions.invoke<{ success: boolean; orderId: string }>(
      'process-payment-success',
      {
        body: { sessionId, userId },
      }
    );

    if (error) {
      console.error('Error processing payment success:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from payment success processing');
    }
    
    console.log("Payment processed successfully, order ID:", data.orderId);
    return { orderId: data.orderId };
  } catch (error) {
    console.error('Error in payment success service:', error);
    // Même en cas d'erreur, nous gardons la session comme traitée pour éviter les boucles infinies
    throw error;
  }
}
