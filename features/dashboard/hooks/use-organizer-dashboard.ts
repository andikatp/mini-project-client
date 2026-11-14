import { useCallback, useEffect, useState } from "react";
import { organizerDashboardApi } from "../api/dashboard-api";
import type {
  DashboardTimeseriesPoint,
  Granularity,
  OrganizerDashboardSummary,
  OrganizerTransaction,
} from "../types";

export function useOrganizerDashboard({ enabled = true }: { enabled?: boolean } = {}) {
  const [summary, setSummary] = useState<OrganizerDashboardSummary | null>(null);
  const [timeseries, setTimeseries] = useState<DashboardTimeseriesPoint[]>([]);
  const [transactions, setTransactions] = useState<OrganizerTransaction[]>([]);
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, timeseriesRes, transactionsRes] = await Promise.all([
        organizerDashboardApi.getSummary(),
        organizerDashboardApi.getTimeseries(granularity, selectedEventId),
        organizerDashboardApi.getTransactions({ limit: 10 }),
      ]);

      if (summaryRes.data) {
        setSummary(summaryRes.data);
      }
      if (timeseriesRes.data) {
        setTimeseries(timeseriesRes.data);
      }
      if (transactionsRes.data) {
        setTransactions(transactionsRes.data.transactions);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [enabled, granularity, selectedEventId]);

  useEffect(() => {
    if (!enabled) return;
    let ignore = false;

    async function load() {
      try {
        const [summaryRes, timeseriesRes, transactionsRes] = await Promise.all([
          organizerDashboardApi.getSummary(),
          organizerDashboardApi.getTimeseries(granularity, selectedEventId),
          organizerDashboardApi.getTransactions({ limit: 10 }),
        ]);

        if (!ignore) {
          if (summaryRes.data) setSummary(summaryRes.data);
          if (timeseriesRes.data) setTimeseries(timeseriesRes.data);
          if (transactionsRes.data) setTransactions(transactionsRes.data.transactions);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard data");
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
  }, [enabled, granularity, selectedEventId]);

  const handleAcceptTransaction = async (transactionId: string) => {
    await organizerDashboardApi.acceptTransactionProof(transactionId);
    await fetchDashboardData();
  };

  const handleRejectTransaction = async (transactionId: string, reason: string) => {
    await organizerDashboardApi.rejectTransactionProof(transactionId, reason);
    await fetchDashboardData();
  };

  return {
    summary,
    timeseries,
    transactions,
    granularity,
    setGranularity,
    selectedEventId,
    setSelectedEventId,
    isLoading,
    error,
    refresh: fetchDashboardData,
    acceptTransaction: handleAcceptTransaction,
    rejectTransaction: handleRejectTransaction,
  };
}
