export interface PointCredit {
  id: string;
  initialAmount: number;
  remainingAmount: number;
  issuedAt: string;
  expiresAt: string;
  isExpired: boolean;
  isUsable: boolean;
}

export interface PointsResponse {
  totalPoints: number;
  credits: PointCredit[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserCoupon {
  id: string;
  code: string;
  status: "AVAILABLE" | "USED" | "EXPIRED";
  issuedAt: string;
  expiredAt: string;
  isUsable: boolean;
}

export interface CouponsResponse {
  coupons: UserCoupon[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
