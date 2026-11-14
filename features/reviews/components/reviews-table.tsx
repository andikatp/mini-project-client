"use client";

import { useMemo } from "react";
import { Image } from "@/lib/router-compat";
import { Star, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerTransaction } from "@/features/transactions/types";
import type { EventReview } from "../types";

interface ReviewsTableProps {
  transactions: CustomerTransaction[];
  reviews: EventReview[];
  onSelectTxForReview: (tx: CustomerTransaction) => void;
}

export function ReviewsTable({ transactions, reviews, onSelectTxForReview }: ReviewsTableProps) {
  const reviewsMap = useMemo(() => {
    const map = new Map<string, EventReview>();
    reviews.forEach((r) => {
      map.set(r.eventId, r);
    });
    return map;
  }, [reviews]);

  return (
    <div className="overflow-x-auto rounded-none border-0 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">Event</TableHead>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">
              Order Code
            </TableHead>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">
              Date & Location
            </TableHead>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">Status</TableHead>
            <TableHead className="text-sm font-semibold py-3 text-right">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {transactions.map((tx) => {
            const existingReview = reviewsMap.get(tx.eventId);
            const formattedDate = tx.event?.startAt
              ? new Date(tx.event.startAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-";

            return (
              <TableRow key={tx.id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-md overflow-hidden shrink-0 bg-muted border border-border">
                      {tx.event?.bannerUrl ? (
                        <Image
                          src={tx.event.bannerUrl}
                          alt={tx.event.title || "Event banner"}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[10px] text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h6 className="text-sm font-semibold truncate text-foreground">
                        {tx.event?.title || "Untitled Event"}
                      </h6>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap font-mono text-xs font-semibold text-muted-foreground">
                  #{tx.code}
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                  {tx.event?.city && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="size-3.5" />
                      <span>{tx.event.city}</span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {existingReview ? (
                    <Badge className="text-xs px-2.5 py-0.5 bg-blue-500/10 text-blue-600 border-blue-500/20">
                      {existingReview.status === "APPROVED"
                        ? "Reviewed"
                        : existingReview.status === "PENDING"
                          ? "Review Pending"
                          : "Review Rejected"}
                    </Badge>
                  ) : (
                    <Badge className="text-xs px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      Attended
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="whitespace-nowrap text-right">
                  {existingReview ? (
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${
                              i < existingReview.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-semibold text-foreground ml-1">
                          {existingReview.rating}/5
                        </span>
                      </div>
                      {existingReview.comment && (
                        <span
                          className="text-[11px] text-muted-foreground max-w-48 truncate"
                          title={existingReview.comment}
                        >
                          &quot;{existingReview.comment}&quot;
                        </span>
                      )}
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onSelectTxForReview(tx)}
                      className="h-8 px-3 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium"
                    >
                      <Star className="size-3.5 mr-1.5 fill-white" />
                      Write Review
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
