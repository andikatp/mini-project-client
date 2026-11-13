import { Coins, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PointsResponse, CouponsResponse } from "../types";

interface RewardsTablesProps {
  pointsData: PointsResponse | null;
  couponsData: CouponsResponse | null;
  isLoading: boolean;
}

export function RewardsTables({ pointsData, couponsData, isLoading }: RewardsTablesProps) {
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Points History */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Coins className="size-4 text-amber-500" />
          <h3 className="font-semibold text-foreground text-base">Points History</h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Initial</TableHead>
                <TableHead className="text-xs">Remaining</TableHead>
                <TableHead className="text-xs">Expires</TableHead>
                <TableHead className="text-xs text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-16 w-full" />
                  </TableCell>
                </TableRow>
              ) : pointsData?.credits?.length ? (
                pointsData.credits.map((cr) => (
                  <TableRow key={cr.id} className="text-xs">
                    <TableCell className="font-medium text-foreground">
                      +{cr.initialAmount.toLocaleString()} pts
                    </TableCell>
                    <TableCell className="font-semibold text-amber-600">
                      {cr.remainingAmount.toLocaleString()} pts
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(cr.expiresAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={`text-[10px] px-2 py-0.5 ${
                          cr.isUsable
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {cr.isUsable ? "Active" : cr.isExpired ? "Expired" : "Used"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                    No point credits yet. Share your referral code to start earning!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Coupons */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Tag className="size-4 text-primary" />
          <h3 className="font-semibold text-foreground text-base">My Coupons</h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Coupon Code</TableHead>
                <TableHead className="text-xs">Discount</TableHead>
                <TableHead className="text-xs">Expires</TableHead>
                <TableHead className="text-xs text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-16 w-full" />
                  </TableCell>
                </TableRow>
              ) : couponsData?.coupons?.length ? (
                couponsData.coupons.map((cp) => (
                  <TableRow key={cp.id} className="text-xs">
                    <TableCell className="font-mono font-semibold text-foreground">
                      {cp.code}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">10% OFF</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(cp.expiredAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={`text-[10px] px-2 py-0.5 ${
                          cp.isUsable
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {cp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                    No coupons available yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
