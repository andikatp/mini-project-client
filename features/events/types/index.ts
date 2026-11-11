export type EventStatus = "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELED";

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
}

export interface EventTicketType {
  id: string;
  name: string;
  priceIdr: number;
  quota: number;
  soldQty: number;
}

export interface OrganizerEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  bannerUrl: string | null;
  location: string | null;
  city: string | null;
  status: EventStatus;
  startAt: string;
  endAt: string;
  category: EventCategory;
  ticketsSold: number;
  totalCapacity: number;
  ticketTypes: EventTicketType[];
}

export interface EventAttendee {
  transactionId: string;
  transactionCode: string;
  customerId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  totalPaidIdr: number;
  ticketQuantity: number;
  tickets: {
    name: string;
    quantity: number;
    priceIdr: number;
  }[];
  purchaseDate: string;
}

export interface EventAttendeesResponse {
  event: {
    id: string;
    title: string;
  };
  attendees: EventAttendee[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}
