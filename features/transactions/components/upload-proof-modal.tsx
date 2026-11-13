import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import type { CustomerTransaction } from "../types";

interface UploadProofModalProps {
  transaction: CustomerTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (transactionId: string, file: File) => Promise<void>;
}

export function UploadProofModal({
  transaction,
  isOpen,
  onClose,
  onUpload,
}: UploadProofModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a proof of payment image.");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      await onUpload(transaction.id, file);
      setFile(null);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload proof");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Upload Payment Proof</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Order: <span className="font-mono font-medium text-foreground">{transaction.code}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="p-3 bg-muted/40 rounded-lg text-xs flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event:</span>
              <span className="font-medium text-foreground">{transaction.event.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount to pay:</span>
              <span className="font-semibold text-primary">
                Rp {transaction.totalIdr.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="proof-file" className="text-xs font-medium text-foreground">
              Select receipt/screenshot (JPEG, PNG, WebP)
            </label>
            <Input
              id="proof-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-xs file:text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isUploading || !file} className="gap-1.5">
              {isUploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={13} />
                  <span>Submit Proof</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
