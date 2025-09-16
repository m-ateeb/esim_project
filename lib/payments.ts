// lib/payments.ts
import Stripe from 'stripe';
import { prisma } from './prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export interface PaymentIntentData {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}

export interface PaymentMethodData {
  type: 'card' | 'apple_pay' | 'google_pay';
  card?: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  };
}

export interface RefundData {
  paymentIntentId: string;
  amount: number;
  reason: string;
}

class PaymentService {
  // Create payment intent
  async createPaymentIntent(data: PaymentIntentData): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        metadata: {
          orderId: data.orderId,
          customerEmail: data.customerEmail,
          ...data.metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: data.customerEmail,
      });

      return paymentIntent;
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  // Confirm payment intent
  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return paymentIntent;
    } catch (error) {
      console.error('Failed to confirm payment intent:', error);
      throw error;
    }
  }

  // Get payment intent
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Failed to get payment intent:', error);
      throw error;
    }
  }

  // Create customer
  async createCustomer(email: string, name?: string, phone?: string): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        phone,
      });

      return customer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  }

  // Get customer
  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      return customer;
    } catch (error) {
      console.error('Failed to get customer:', error);
      throw error;
    }
  }

  // Update customer
  async updateCustomer(customerId: string, data: Partial<Stripe.CustomerUpdateParams>): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.update(customerId, data);
      return customer;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  }

  // Create payment method
  async createPaymentMethod(data: PaymentMethodData): Promise<Stripe.PaymentMethod> {
    try {
      let paymentMethodData: Stripe.PaymentMethodCreateParams = {
        type: data.type,
      };

      if (data.type === 'card' && data.card) {
        paymentMethodData.card = {
          number: data.card.number,
          exp_month: data.card.expMonth,
          exp_year: data.card.expYear,
          cvc: data.card.cvc,
        };
      }

      const paymentMethod = await stripe.paymentMethods.create(paymentMethodData);
      return paymentMethod;
    } catch (error) {
      console.error('Failed to create payment method:', error);
      throw error;
    }
  }

  // Attach payment method to customer
  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      return paymentMethod;
    } catch (error) {
      console.error('Failed to attach payment method:', error);
      throw error;
    }
  }

  // Get customer payment methods
  async getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Failed to get customer payment methods:', error);
      throw error;
    }
  }

  // Create refund
  async createRefund(data: RefundData): Promise<Stripe.Refund> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: data.paymentIntentId,
        amount: data.amount,
        reason: data.reason as Stripe.RefundCreateParams.Reason,
      });

      return refund;
    } catch (error) {
      console.error('Failed to create refund:', error);
      throw error;
    }
  }

  // Get refund
  async getRefund(refundId: string): Promise<Stripe.Refund> {
    try {
      const refund = await stripe.refunds.retrieve(refundId);
      return refund;
    } catch (error) {
      console.error('Failed to get refund:', error);
      throw error;
    }
  }

  // Create subscription (for recurring plans)
  async createSubscription(customerId: string, priceId: string, metadata?: Record<string, string>): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  // Get subscription
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Failed to get subscription:', error);
      throw error;
    }
  }

  // Create invoice
  async createInvoice(customerId: string, items: Array<{ price: string; quantity?: number }>): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.create({
        customer: customerId,
        collection_method: 'charge_automatically',
        items,
      });

      return invoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  }

  // Finalize invoice
  async finalizeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.finalizeInvoice(invoiceId);
      return invoice;
    } catch (error) {
      console.error('Failed to finalize invoice:', error);
      throw error;
    }
  }

  // Pay invoice
  async payInvoice(invoiceId: string, paymentMethodId?: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.pay(invoiceId, {
        payment_method: paymentMethodId,
      });

      return invoice;
    } catch (error) {
      console.error('Failed to pay invoice:', error);
      throw error;
    }
  }

  // Get invoice
  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.retrieve(invoiceId);
      return invoice;
    } catch (error) {
      console.error('Failed to get invoice:', error);
      throw error;
    }
  }

  // Create webhook endpoint
  async createWebhookEndpoint(url: string, events: string[]): Promise<Stripe.WebhookEndpoint> {
    try {
      const webhookEndpoint = await stripe.webhookEndpoints.create({
        url,
        enabled_events: events as Stripe.WebhookEndpointCreateParams.EnabledEvent[],
      });

      return webhookEndpoint;
    } catch (error) {
      console.error('Failed to create webhook endpoint:', error);
      throw error;
    }
  }

  // Get webhook endpoints
  async getWebhookEndpoints(): Promise<Stripe.WebhookEndpoint[]> {
    try {
      const webhookEndpoints = await stripe.webhookEndpoints.list();
      return webhookEndpoints.data;
    } catch (error) {
      console.error('Failed to get webhook endpoints:', error);
      throw error;
    }
  }

  // Delete webhook endpoint
  async deleteWebhookEndpoint(webhookEndpointId: string): Promise<Stripe.DeletedWebhookEndpoint> {
    try {
      const webhookEndpoint = await stripe.webhookEndpoints.del(webhookEndpointId);
      return webhookEndpoint;
    } catch (error) {
      console.error('Failed to delete webhook endpoint:', error);
      throw error;
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string, secret: string): Stripe.Event {
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, secret);
      return event;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw error;
    }
  }

  // Update order payment status
  async updateOrderPaymentStatus(orderId: string, paymentIntentId: string, status: string): Promise<boolean> {
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          stripePaymentIntentId: paymentIntentId,
          paymentStatus: status as any,
          paidAt: status === 'COMPLETED' ? new Date() : null,
        },
      });

      return true;
    } catch (error) {
      console.error('Failed to update order payment status:', error);
      return false;
    }
  }

  // Get payment analytics
  async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<{
    totalRevenue: number;
    totalOrders: number;
    successfulPayments: number;
    failedPayments: number;
    averageOrderValue: number;
  }> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          finalAmount: true,
          paymentStatus: true,
        },
      });

      const totalRevenue = orders
        .filter(order => order.paymentStatus === 'COMPLETED')
        .reduce((sum, order) => sum + Number(order.finalAmount), 0);

      const totalOrders = orders.length;
      const successfulPayments = orders.filter(order => order.paymentStatus === 'COMPLETED').length;
      const failedPayments = orders.filter(order => order.paymentStatus === 'FAILED').length;
      const averageOrderValue = successfulPayments > 0 ? totalRevenue / successfulPayments : 0;

      return {
        totalRevenue,
        totalOrders,
        successfulPayments,
        failedPayments,
        averageOrderValue,
      };
    } catch (error) {
      console.error('Failed to get payment analytics:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
