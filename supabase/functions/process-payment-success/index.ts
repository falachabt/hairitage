
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@13.11.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProcessPaymentRequest {
  sessionId: string;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, userId }: ProcessPaymentRequest = await req.json();

    console.log("Processing payment success for session:", sessionId);

    // Retrieve the session from Stripe
    // IMPORTANT: Expand line_items and customer_details but NOT shipping_details as it's not supported
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "customer_details"],
    });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Extract shipping information directly from session.shipping
    const shipping = session.shipping?.address;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;

    // Insert the order into the database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        payment_status: "completed",
        status: "processing",
        total_amount: Number(session.metadata?.order_total || session.amount_total! / 100),
        shipping_address: shipping?.line1,
        shipping_city: shipping?.city,
        shipping_postal_code: shipping?.postal_code,
        shipping_country: shipping?.country,
        payment_method: "card",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log("Order created:", order.id);

    // Insert order items
    if (session.line_items && session.line_items.data.length > 0) {
      const orderItems = session.line_items.data
        .filter(item => item.description !== "Frais de livraison") // Skip shipping
        .map(item => {
          // Récupérer l'ID du produit depuis le prix
          let productId = null;
          if (item.price && item.price.product) {
            // Si item.price.product est déjà un objet étendu avec id
            const product = typeof item.price.product === 'string' 
              ? item.price.product 
              : (item.price.product as any).id;
              
            productId = product;
          }
          
          return {
            order_id: order.id,
            product_id: productId,
            quantity: item.quantity || 1,
            unit_price: (item.price?.unit_amount || 0) / 100,
            total_price: ((item.price?.unit_amount || 0) * (item.quantity || 1)) / 100,
          };
        });

      console.log("Inserting order items:", JSON.stringify(orderItems));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Continue anyway, as the main order was created
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        orderId: order.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error processing payment success:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
