"use client";

import { useCallback, useEffect, useState } from "react";
import { rewardsApi } from "../api/rewards-api";
import type { PointsResponse, CouponsResponse } from "../types";

export function useCustomerRewards() {
  const [pointsData, setPointsData] = useState<PointsResponse | null>(null);
  const [couponsData, setCouponsData] = useState<CouponsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pts, cps] = await Promise.all([rewardsApi.getMyPoints(), rewardsApi.getMyCoupons()]);
      if (pts.data) setPointsData(pts.data);
      if (cps.data) setCouponsData(cps.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load rewards");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [pts, cps] = await Promise.all([rewardsApi.getMyPoints(), rewardsApi.getMyCoupons()]);
        if (!ignore) {
          if (pts.data) setPointsData(pts.data);
          if (cps.data) setCouponsData(cps.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load rewards");
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

  return {
    pointsData,
    couponsData,
    isLoading,
    error,
    refresh: fetchRewards,
  };
}
