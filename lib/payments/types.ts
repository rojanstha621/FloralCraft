export type SupportedPaymentProvider =
  | "ESEWA"
  | "KHALTI"
  | "FONEPAY"
  | "CASH_ON_DELIVERY"
  | "BANK_TRANSFER";

export interface InitiatePaymentParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  callbackUrl: string;
  returnUrl: string;
}

export interface PaymentInitiationResult {
  provider: SupportedPaymentProvider;
  transactionId: string;
  redirectUrl?: string;
  formData?: Record<string, string>;
  isMock: boolean;
  instructions?: string;
}

export interface VerifyPaymentParams {
  orderId: string;
  transactionRef?: string;
  providerData?: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  transactionRef: string;
  amount: number;
  provider: SupportedPaymentProvider;
  message: string;
  rawResponse?: unknown;
}

export interface PaymentGateway {
  readonly provider: SupportedPaymentProvider;
  initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiationResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult>;
}
