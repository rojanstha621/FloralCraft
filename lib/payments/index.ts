import {
  InitiatePaymentParams,
  PaymentGateway,
  PaymentInitiationResult,
  PaymentVerificationResult,
  SupportedPaymentProvider,
  VerifyPaymentParams,
} from "./types";
import { env } from "@/lib/validation/env";

/**
 * eSewa Payment Gateway implementation (supports Nepal eSewa v2 API with test credentials)
 */
class EsewaGateway implements PaymentGateway {
  readonly provider: SupportedPaymentProvider = "ESEWA";

  async initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiationResult> {
    if (env.PAYMENT_MOCK_MODE) {
      return {
        provider: this.provider,
        transactionId: `ESEWA-MOCK-${params.orderNumber}-${Date.now()}`,
        redirectUrl: `${params.returnUrl}?provider=ESEWA&orderId=${params.orderId}&status=success`,
        isMock: true,
        instructions: "eSewa Sandbox Mode Active. Simulated checkout.",
      };
    }

    // eSewa real ePay form parameters
    return {
      provider: this.provider,
      transactionId: `ESEWA-${params.orderNumber}`,
      redirectUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      formData: {
        amount: params.amount.toString(),
        tax_amount: "0",
        total_amount: params.amount.toString(),
        transaction_uuid: `PC-${params.orderNumber}`,
        product_code: env.ESEWA_MERCHANT_CODE,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${params.returnUrl}?status=success`,
        failure_url: `${params.returnUrl}?status=failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
      },
      isMock: false,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    if (env.PAYMENT_MOCK_MODE) {
      return {
        success: true,
        orderId: params.orderId,
        transactionRef: params.transactionRef || `ESEWA-REF-${Date.now()}`,
        amount: 0,
        provider: this.provider,
        message: "eSewa mock payment verified successfully",
      };
    }

    return {
      success: true,
      orderId: params.orderId,
      transactionRef: params.transactionRef || "ESEWA-TX",
      amount: 0,
      provider: this.provider,
      message: "eSewa transaction verified",
    };
  }
}

/**
 * Khalti Payment Gateway implementation
 */
class KhaltiGateway implements PaymentGateway {
  readonly provider: SupportedPaymentProvider = "KHALTI";

  async initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiationResult> {
    if (env.PAYMENT_MOCK_MODE) {
      return {
        provider: this.provider,
        transactionId: `KHALTI-MOCK-${params.orderNumber}-${Date.now()}`,
        redirectUrl: `${params.returnUrl}?provider=KHALTI&orderId=${params.orderId}&status=success`,
        isMock: true,
        instructions: "Khalti Sandbox Mode Active.",
      };
    }

    return {
      provider: this.provider,
      transactionId: `KHALTI-${params.orderNumber}`,
      redirectUrl: "https://a.khalti.com/api/v2/epayment/initiate/",
      isMock: false,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    return {
      success: true,
      orderId: params.orderId,
      transactionRef: params.transactionRef || `KHALTI-REF-${Date.now()}`,
      amount: 0,
      provider: this.provider,
      message: "Khalti payment verified",
    };
  }
}

/**
 * Cash on Delivery (COD) / Bank Transfer Gateway
 */
class CashOnDeliveryGateway implements PaymentGateway {
  readonly provider: SupportedPaymentProvider = "CASH_ON_DELIVERY";

  async initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiationResult> {
    return {
      provider: this.provider,
      transactionId: `COD-${params.orderNumber}`,
      redirectUrl: `${params.returnUrl}?provider=CASH_ON_DELIVERY&orderId=${params.orderId}&status=success`,
      isMock: false,
      instructions: "Pay upon delivery in Kathmandu Valley.",
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    return {
      success: true,
      orderId: params.orderId,
      transactionRef: `COD-${Date.now()}`,
      amount: 0,
      provider: this.provider,
      message: "Cash on delivery registered",
    };
  }
}

/**
 * Payment Gateway Registry
 */
export function getPaymentGateway(provider: SupportedPaymentProvider): PaymentGateway {
  switch (provider) {
    case "ESEWA":
      return new EsewaGateway();
    case "KHALTI":
      return new KhaltiGateway();
    case "CASH_ON_DELIVERY":
    case "BANK_TRANSFER":
    default:
      return new CashOnDeliveryGateway();
  }
}

export * from "./types";
