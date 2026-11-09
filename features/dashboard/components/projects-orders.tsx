"use client";

import { DashboardCard } from "@/components/common/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, Clock, ExternalLink, Receipt } from "lucide-react";
import SimpleBar from "simplebar-react";
import type { OrganizerTransaction, TransactionStatus } from "../types";

interface ProjectsOrdersProps {
  transactions: OrganizerTransaction[];
  isLoading?: boolean;
  onAccept?: (transactionId: string) => Promise<void>;
  onReject?: (transactionId: string, reason: string) => Promise<void>;
}

const statusConfig: Record<
  TransactionStatus,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  DONE: {
    label: "Done",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle,
  },
  WAITING_FOR_ADMIN_CONFIRMATION: {
    label: "Needs Review",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    icon: AlertCircle,
  },
  WAITING_FOR_PAYMENT: {
    label: "Waiting Payment",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    icon: Clock,
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    icon: AlertCircle,
  },
  CANCELED: {
    label: "Canceled",
    bg: "bg-zinc-500/10",
    text: "text-zinc-600 dark:text-zinc-400",
    icon: AlertCircle,
  },
  EXPIRED: {
    label: "Expired",
    bg: "bg-zinc-500/10",
    text: "text-zinc-600 dark:text-zinc-400",
    icon: Clock,
  },
};

export default function ProjectsOrders({
  transactions,
  isLoading,
  onAccept,
  onReject,
}: ProjectsOrdersProps) {
  return (
    <DashboardCard className="flex flex-col gap-0! pb-0!">
      <CardHeader className="border-b border-border flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Receipt size={16} className="text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide text-foreground">
            Recent Transactions
          </CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">{transactions.length} latest records</span>
      </CardHeader>

      <CardContent className="p-0">
        <SimpleBar style={{ maxHeight: 380 }}>
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Transaction</TableHead>
                <TableHead className="text-xs font-semibold">Event</TableHead>
                <TableHead className="text-xs font-semibold">Customer</TableHead>
                <TableHead className="text-xs font-semibold text-right">Qty</TableHead>
                <TableHead className="text-xs font-semibold text-right">Total</TableHead>
                <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-xs text-muted-foreground">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-xs text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((trx) => {
                  const cfg = statusConfig[trx.status] ?? statusConfig.DONE;
                  const Icon = cfg.icon;
                  const totalTickets = trx.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <TableRow key={trx.id} className="text-xs hover:bg-muted/30">
                      <TableCell className="font-mono font-medium text-foreground">
                        {trx.code}
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate" title={trx.event.title}>
                        {trx.event.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground truncate">
                            {trx.customer.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {trx.customer.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{totalTickets}</TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        Rp {trx.totalIdr.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={`${cfg.bg} ${cfg.text} border-0 text-[10px] font-medium px-2 py-0.5 inline-flex items-center gap-1`}
                        >
                          <Icon size={11} />
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {trx.status === "WAITING_FOR_ADMIN_CONFIRMATION" && onAccept ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {trx.paymentProof?.fileUrl && (
                              <a
                                href={trx.paymentProof.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Proof"
                                className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] px-2 text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                              onClick={() => {
                                void onAccept(trx.id);
                              }}
                            >
                              Accept
                            </Button>
                            {onReject && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-[10px] px-2 text-rose-600 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                onClick={() => {
                                  const reason = window.prompt("Reason for rejection:");
                                  if (reason) {
                                    void onReject(trx.id, reason);
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(trx.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </SimpleBar>
      </CardContent>
    </DashboardCard>
  );
}
