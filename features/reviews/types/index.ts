export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewCustomer {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ReviewEvent {
  id: string;
  title: string;
  slug: string;
}

export interface EventReview {
  id: string;
  customerId: string;
  eventId: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: ReviewCustomer;
  event?: ReviewEvent;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string | null;
}
