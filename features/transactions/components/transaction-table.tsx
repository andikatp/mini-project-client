import Image from "next/image";
import { Upload, XCircle, Clock, CheckCircle2, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomerTransaction } from "../types";
import { STATUS_CONFIG } from "./transaction-status-config";

interface TransactionTableProps {
  transactions: CustomerTransaction[];
  onOpenUpload: (transaction: CustomerTransaction) => void;
  onCancel: (transactionId: string) => void;
  onOpenReview?: (transaction: CustomerTransaction) => void;
  cancellingId?: string | null;
}

export function TransactionTable({
  transactions,
  onOpenUpload,
  onCancel,
  onOpenReview,
  cancellingId,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">
              Order Code
            </TableHead>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">Event</TableHead>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">Tickets</TableHead>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">
              Total Price
            </TableHead>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">Status</TableHead>
            <TableHead className="text-sm font-semibold py-3 whitespace-nowrap">Date</TableHead>
            <TableHead className="text-sm font-semibold py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {transactions.map((tx) => {
            const statusInfo = STATUS_CONFIG[tx.status] ?? {
              label: tx.status,
              badgeClass: "bg-muted text-muted-foreground",
            };
            const canUploadProof = tx.status === "WAITING_FOR_PAYMENT" || tx.status === "REJECTED";
            const canCancel = tx.status === "WAITING_FOR_PAYMENT";
            const totalQty = tx.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

            const isEventEnded = Boolean(tx.event?.endAt);
            const canReview = tx.status === "DONE" && isEventEnded;

            const formattedDate = tx.createdAt
              ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-";

            return (
              <TableRow key={tx.id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="whitespace-nowrap font-mono text-xs font-semibold text-muted-foreground">
                  #{tx.code}
                </TableCell>
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
                      <p className="text-xs text-muted-foreground truncate">
                        {tx.event?.city || "Online"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">{totalQty}</span> ticket
                    {totalQty > 1 ? "s" : ""}
                  </div>
                  {tx.items && tx.items.length > 0 && (
                    <div className="text-[11px] text-muted-foreground truncate max-w-44">
                      {tx.items.map((i) => `${i.ticketName} (${i.quantity})`).join(", ")}
                    </div>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm font-bold text-foreground">
                  Rp {Number(tx.totalIdr || 0).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge className={`text-xs px-2.5 py-0.5 font-medium ${statusInfo.badgeClass}`}>
                    {statusInfo.label}
                  </Badge>
                  {tx.paymentProof?.rejectionReason && (
                    <p className="text-[11px] text-destructive truncate max-w-44 mt-1">
                      {tx.paymentProof.rejectionReason}
                    </p>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formattedDate}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancel(tx.id)}
                        disabled={cancellingId === tx.id}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border h-8 px-2.5 text-xs"
                      >
                        <XCircle className="size-3.5 mr-1" />
                        Cancel
                      </Button>
                    )}

                    {canUploadProof && (
                      <Button
                        size="sm"
                        onClick={() => onOpenUpload(tx)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-2.5"
                      >
                        <Upload className="size-3.5 mr-1" />
                        {tx.paymentProof ? "Re-upload" : "Upload Proof"}
                      </Button>
                    )}

                    {canReview && onOpenReview && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenReview(tx)}
                        className="h-8 px-2.5 text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                      >
                        <Star className="size-3.5 mr-1 fill-amber-400 text-amber-400" />
                        Review
                      </Button>
                    )}

                    {tx.status === "WAITING_FOR_ADMIN_CONFIRMATION" && (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-500/10 px-2 py-1 rounded">
                        <Clock className="size-3 animate-pulse" />
                        In Review
                      </span>
                    )}

                    {tx.status === "DONE" && !canReview && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">
                        <CheckCircle2 className="size-3" />
                        Confirmed
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
