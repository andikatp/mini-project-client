import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import type { TransactionStatus } from "../types";

export const statusConfig: Record<
  TransactionStatus,
  { label: string; bg: string; text: string; badgeClass: string; icon: React.ElementType }
> = {
  DONE: {
    label: "Done",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle,
  },
  WAITING_FOR_ADMIN_CONFIRMATION: {
    label: "Waiting Confirmation",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Clock,
  },
  WAITING_FOR_PAYMENT: {
    label: "Waiting Payment",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: AlertCircle,
  },
  CANCELED: {
    label: "Canceled",
    bg: "bg-zinc-500/10",
    text: "text-zinc-600 dark:text-zinc-400",
    badgeClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    icon: XCircle,
  },
  EXPIRED: {
    label: "Expired",
    bg: "bg-zinc-500/10",
    text: "text-zinc-600 dark:text-zinc-400",
    badgeClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    icon: Clock,
  },
};

export const STATUS_CONFIG = statusConfig;
