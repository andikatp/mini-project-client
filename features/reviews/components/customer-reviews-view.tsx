"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star, Calendar, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerTransactions } from "@/features/transactions/hooks/use-customer-transactions";
import type { CustomerTransaction } from "@/features/transactions/types";
import { WriteReviewModal } from "./write-review-modal";

export function CustomerReviewsView() {
  const { transactions, isLoading, error, refresh } = useCustomerTransactions();
  const [selectedTxForReview, setSelectedTxForReview] = useState<CustomerTransaction | null>(null);

  const eligibleTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.status === "DONE" && Boolean(tx.event));
  }, [transactions]);

  return (
    <Card className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">My Reviews</h2>
          <p className="text-sm text-muted-foreground">
            Review completed events you have attended and share your feedback.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
          className="border-border text-foreground hover:bg-muted"
        >
          <RefreshCw className={`size-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Failed to load events</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : eligibleTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Star className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">No events to review yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            You can review events after your ticket purchase is completed and the event has taken
            place.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">
                  Event
                </TableHead>
                <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">
                  Order Code
                </TableHead>
                <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">
                  Date & Location
                </TableHead>
                <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="text-sm font-semibold py-3 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {eligibleTransactions.map((tx) => {
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
                        <div className="relative size-10 rounded-md overflow-hidden shrink-0 bg-muted border">
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
                      <Badge className="text-xs px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        Attended
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-right">
                      <Button
                        size="sm"
                        onClick={() => setSelectedTxForReview(tx)}
                        className="h-8 px-3 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium"
                      >
                        <Star className="size-3.5 mr-1.5 fill-white" />
                        Write Review
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedTxForReview && (
        <WriteReviewModal
          isOpen={Boolean(selectedTxForReview)}
          onClose={() => setSelectedTxForReview(null)}
          eventId={selectedTxForReview.eventId}
          eventTitle={selectedTxForReview.event?.title || "Event"}
          onSuccess={refresh}
        />
      )}
    </Card>
  );
}
