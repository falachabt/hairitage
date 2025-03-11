
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

export async function createPaymentSession(request: PaymentSessionRequest): Promise<PaymentSessionResponse> {
  try {
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

    return data;
  } catch (error) {
    console.error('Error in payment service:', error);
    throw error;
  }
}

export async function processPaymentSuccess(sessionId: string, userId?: string): Promise<{ orderId: string }> {
  try {
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

    return { orderId: data.orderId };
  } catch (error) {
    console.error('Error in payment success service:', error);
    throw error;
  }
}
