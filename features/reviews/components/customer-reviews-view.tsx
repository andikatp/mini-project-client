"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Star, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCustomerTransactions } from "@/features/transactions/hooks/use-customer-transactions";
import type { CustomerTransaction } from "@/features/transactions/types";
import { reviewsApi } from "../api/reviews-api";
import type { EventReview } from "../types";
import { ReviewsTable } from "./reviews-table";
import { WriteReviewModal } from "./write-review-modal";

export function CustomerReviewsView() {
  const {
    transactions,
    isLoading: isTxLoading,
    error: txError,
    refresh: refreshTx,
  } = useCustomerTransactions();
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [selectedTxForReview, setSelectedTxForReview] = useState<CustomerTransaction | null>(null);

  const fetchMyReviews = useCallback(async () => {
    setIsReviewsLoading(true);
    setReviewError(null);
    try {
      const res = await reviewsApi.getMyReviews();
      if (res.data) {
        setReviews(res.data);
      }
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setIsReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsReviewsLoading(true);
      setReviewError(null);
      try {
        const res = await reviewsApi.getMyReviews();
        if (!ignore && res.data) {
          setReviews(res.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setReviewError(err instanceof Error ? err.message : "Failed to load reviews");
        }
      } finally {
        if (!ignore) {
          setIsReviewsLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefreshAll = () => {
    void refreshTx();
    void fetchMyReviews();
  };

  const eligibleTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.status === "DONE" && Boolean(tx.event));
  }, [transactions]);

  const isLoading = isTxLoading || isReviewsLoading;
  const error = txError || reviewError;

  return (
    <div className="p-6 flex flex-col gap-6 rounded-none bg-background">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">My Reviews</h2>
          <p className="text-sm text-muted-foreground">
            Review completed events you have attended and view your past feedback.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshAll}
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
          <AlertTitle>Notice</AlertTitle>
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
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-md text-center">
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
        <ReviewsTable
          transactions={eligibleTransactions}
          reviews={reviews}
          onSelectTxForReview={(tx) => setSelectedTxForReview(tx)}
        />
      )}

      {selectedTxForReview && (
        <WriteReviewModal
          isOpen={Boolean(selectedTxForReview)}
          onClose={() => setSelectedTxForReview(null)}
          eventId={selectedTxForReview.eventId}
          eventTitle={selectedTxForReview.event?.title || "Event"}
          onSuccess={handleRefreshAll}
        />
      )}
    </div>
  );
}
