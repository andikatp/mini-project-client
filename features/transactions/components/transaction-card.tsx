import { Calendar, MapPin, Upload, XCircle, Clock, CheckCircle2 } from "lucide-react";
import { Image } from "@/lib/router-compat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CustomerTransaction } from "../types";
import { STATUS_CONFIG } from "./transaction-status-config";

interface TransactionCardProps {
  transaction: CustomerTransaction;
  onOpenUpload: (transaction: CustomerTransaction) => void;
  onCancel: (transactionId: string) => void;
  isCancelling?: boolean;
}

export function TransactionCard({
  transaction,
  onOpenUpload,
  onCancel,
  isCancelling,
}: TransactionCardProps) {
  const statusInfo = STATUS_CONFIG[transaction.status] ?? {
    label: transaction.status,
    badgeClass: "bg-muted text-muted-foreground",
  };

  const formattedDate = transaction.event?.startAt
    ? new Date(transaction.event.startAt).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  const totalTickets = transaction.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const canUploadProof =
    transaction.status === "WAITING_FOR_PAYMENT" || transaction.status === "REJECTED";
  const canCancel = transaction.status === "WAITING_FOR_PAYMENT";

  return (
    <Card className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-border hover:border-border/80 transition-all">
      <div className="flex gap-4 items-start w-full md:w-auto flex-1">
        <div className="relative size-20 sm:size-24 rounded-lg overflow-hidden shrink-0 bg-muted border">
          {transaction.event?.bannerUrl ? (
            <Image
              src={transaction.event.bannerUrl}
              alt={transaction.event.title || "Event banner"}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No banner
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              #{transaction.code}
            </span>
            <Badge className={`text-xs px-2 py-0.5 font-medium ${statusInfo.badgeClass}`}>
              {statusInfo.label}
            </Badge>
          </div>

          <h4 className="font-semibold text-base sm:text-lg text-foreground line-clamp-1">
            {transaction.event?.title || "Untitled Event"}
          </h4>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              <span>{formattedDate}</span>
            </div>
            {transaction.event?.city && (
              <div className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                <span>{transaction.event.city}</span>
              </div>
            )}
            <span className="text-muted-foreground/60">•</span>
            <span>
              {totalTickets} ticket{totalTickets > 1 ? "s" : ""}
            </span>
          </div>

          {transaction.items && transaction.items.length > 0 && (
            <p className="text-xs text-muted-foreground/80 mt-0.5 line-clamp-1">
              {transaction.items.map((it) => `${it.ticketName} × ${it.quantity}`).join(", ")}
            </p>
          )}

          {transaction.paymentProof?.rejectionReason && (
            <div className="mt-2 p-2 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <span className="font-semibold">Rejection note: </span>
              {transaction.paymentProof.rejectionReason}
            </div>
          )}
        </div>
      </div>

      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 shrink-0">
        <div className="text-left md:text-right">
          <span className="text-xs text-muted-foreground block">Total Amount</span>
          <span className="text-base sm:text-lg font-bold text-foreground">
            Rp {Number(transaction.totalIdr || 0).toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(transaction.id)}
              disabled={isCancelling}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border"
            >
              <XCircle className="size-3.5 mr-1.5" />
              Cancel
            </Button>
          )}

          {canUploadProof && (
            <Button
              size="sm"
              onClick={() => onOpenUpload(transaction)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <Upload className="size-3.5 mr-1.5" />
              {transaction.paymentProof ? "Re-upload Proof" : "Upload Proof"}
            </Button>
          )}

          {transaction.status === "WAITING_FOR_ADMIN_CONFIRMATION" && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-500/10 px-3 py-1.5 rounded-md font-medium">
              <Clock className="size-3.5 animate-pulse" />
              <span>In Review</span>
            </div>
          )}

          {transaction.status === "DONE" && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-md font-medium">
              <CheckCircle2 className="size-3.5" />
              <span>Paid & Confirmed</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
