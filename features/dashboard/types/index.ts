export interface OrganizerDashboardSummary {
  totalRevenueIdr: number;
  totalTransactionsCount: number;
  totalTicketsSold: number;
  activeEventsCount: number;
  totalEventsCount: number;
  pendingConfirmationsCount: number;
  events: {
    id: string;
    title: string;
    slug: string;
    status: string;
    ticketsSold: number;
    totalCapacity: number;
  }[];
}

export interface DashboardTimeseriesPoint {
  label: string;
  date: string;
  revenueIdr: number;
  ticketsSold: number;
  transactionCount: number;
}

export type Granularity = "day" | "month" | "year";

export type TransactionStatus =
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_ADMIN_CONFIRMATION"
  | "DONE"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELED";

export interface OrganizerTransactionItem {
  id: string;
  ticketTypeId: string;
  ticketName: string;
  priceIdr: number;
  quantity: number;
  subtotalIdr: number;
  createdAt: string;
}

export interface OrganizerPaymentProof {
  id: string;
  transactionId: string;
  fileUrl: string;
  reviewedByUserId: string | null;
  rejectionReason: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
}

export interface OrganizerTransaction {
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
  customer: {
    id: string;
    name: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    slug: string;
  };
  items: OrganizerTransactionItem[];
  paymentProof: OrganizerPaymentProof | null;
}

export interface OrganizerTransactionsResponse {
  transactions: OrganizerTransaction[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}
