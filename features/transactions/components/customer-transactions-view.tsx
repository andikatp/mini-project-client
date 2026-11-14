"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Ticket, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { WriteReviewModal } from "@/features/reviews/components/write-review-modal";
import { reviewsApi } from "@/features/reviews/api/reviews-api";
import type { EventReview } from "@/features/reviews/types";
import { useCustomerTransactions } from "../hooks/use-customer-transactions";
import type { CustomerTransaction } from "../types";
import { TransactionStatsCards } from "./transaction-stats-cards";
import { TransactionSearchFilter } from "./transaction-search-filter";
import { TransactionTable } from "./transaction-table";
import { TransactionPagination } from "./transaction-pagination";
import { UploadProofModal } from "./upload-proof-modal";

const ITEMS_PER_PAGE = 8;

export function CustomerTransactionsView() {
  const {
    transactions,
    isLoading: isTxLoading,
    error,
    refresh: refreshTx,
    uploadProof,
    cancelTransaction,
  } = useCustomerTransactions();

  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxForUpload, setSelectedTxForUpload] = useState<CustomerTransaction | null>(null);
  const [selectedTxForReview, setSelectedTxForReview] = useState<CustomerTransaction | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchMyReviews = useCallback(async () => {
    setIsReviewsLoading(true);
    try {
      const res = await reviewsApi.getMyReviews();
      if (res.data) {
        setReviews(res.data);
      }
    } catch {
    } finally {
      setIsReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await reviewsApi.getMyReviews();
        if (!ignore && res.data) {
          setReviews(res.data);
        }
      } catch {
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

  const reviewsMap = useMemo(() => {
    const map = new Map<string, EventReview>();
    for (const r of reviews) {
      map.set(r.eventId, r);
    }
    return map;
  }, [reviews]);

  const refreshAll = () => {
    void refreshTx();
    void fetchMyReviews();
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesStatus = statusFilter === "ALL" || tx.status === statusFilter;
      const term = search.toLowerCase().trim();
      const matchesSearch =
        !term ||
        tx.code.toLowerCase().includes(term) ||
        (tx.event?.title && tx.event.title.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [transactions, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedTransactions = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, safeCurrentPage]);

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearch(term);
    setCurrentPage(1);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this transaction?")) return;
    try {
      setCancellingId(id);
      await cancelTransaction(id);
    } finally {
      setCancellingId(null);
    }
  };

  const isLoading = isTxLoading || isReviewsLoading;

  return (
    <div className="p-6 flex flex-col gap-6 rounded-none bg-background">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">My Transactions</h2>
          <p className="text-sm text-muted-foreground">
            Track your tickets, view status, and manage payment proofs.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshAll}
          disabled={isLoading}
          className="border-border text-foreground hover:bg-muted"
        >
          <RefreshCw className={`size-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <TransactionStatsCards
        transactions={transactions}
        activeFilter={statusFilter}
        onFilterChange={handleFilterChange}
      />

      <TransactionSearchFilter
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleFilterChange}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Failed to load transactions</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full rounded-md" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-md text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Ticket className="size-6" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">No transactions found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your search terms or filter selection."
              : "You haven't purchased any tickets yet. Browse events to get tickets!"}
          </p>
        </div>
      ) : (
        <>
          <TransactionTable
            transactions={paginatedTransactions}
            reviewsMap={reviewsMap}
            onOpenUpload={setSelectedTxForUpload}
            onCancel={handleCancel}
            onOpenReview={setSelectedTxForReview}
            cancellingId={cancellingId}
          />

          <TransactionPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalItems={filteredTransactions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <UploadProofModal
        isOpen={Boolean(selectedTxForUpload)}
        onClose={() => setSelectedTxForUpload(null)}
        transaction={selectedTxForUpload}
        onUpload={uploadProof}
      />

      {selectedTxForReview && (
        <WriteReviewModal
          isOpen={Boolean(selectedTxForReview)}
          onClose={() => setSelectedTxForReview(null)}
          eventId={selectedTxForReview.eventId}
          eventTitle={selectedTxForReview.event?.title || "Event"}
          onSuccess={refreshAll}
        />
      )}
    </div>
  );
}
