"use client";

import { useCallback, useEffect, useState } from "react";
import { customerTransactionsApi } from "../api/transactions-api";
import type { CustomerTransaction } from "../types";

export function useCustomerTransactions() {
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerTransactionsApi.getMyTransactions();
      if (res.data) {
        setTransactions(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await customerTransactionsApi.getMyTransactions();
        if (!ignore && res.data) {
          setTransactions(res.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load transactions");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const uploadProof = async (transactionId: string, file: File) => {
    await customerTransactionsApi.uploadPaymentProof(transactionId, file);
    await fetchTransactions();
  };

  const cancelTransaction = async (transactionId: string) => {
    await customerTransactionsApi.cancelTransaction(transactionId);
    await fetchTransactions();
  };

  return {
    transactions,
    isLoading,
    error,
    refresh: fetchTransactions,
    uploadProof,
    cancelTransaction,
  };
}
