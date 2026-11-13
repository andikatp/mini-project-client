export type TransactionStatus =
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_ADMIN_CONFIRMATION"
  | "DONE"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELED";

export interface CustomerTransactionItem {
  id: string;
  transactionId: string;
  ticketTypeId: string;
  ticketName: string;
  priceIdr: number;
  quantity: number;
  subtotalIdr: number;
  createdAt: string;
}

export interface CustomerPaymentProof {
  id: string;
  transactionId: string;
  fileUrl: string;
  rejectionReason: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
}

export interface CustomerTransactionEvent {
  id: string;
  title: string;
  slug: string;
  bannerUrl: string | null;
  location: string | null;
  city: string | null;
  startAt: string;
  endAt: string;
}

export interface CustomerTransaction {
  id: string;
  code: string;
  customerId: string;
  eventId: string;
  status: TransactionStatus;
  subtotalIdr: number;
  voucherDiscountIdr: number;
  couponDiscountIdr: number;
  pointsUsed: number;
  totalIdr: number;
  paymentExpiresAt: string;
  proofUploadedAt: string | null;
  confirmationDueAt: string | null;
  rollbackProcessedAt: string | null;
  createdAt: string;
  updatedAt: string;
  event: CustomerTransactionEvent;
  items: CustomerTransactionItem[];
  paymentProof: CustomerPaymentProof | null;
}
