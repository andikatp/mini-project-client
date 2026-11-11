"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users } from "lucide-react";
import SimpleBar from "simplebar-react";
import type { EventAttendeesResponse } from "../types";

interface EventAttendeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EventAttendeesResponse | null;
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
}

export function EventAttendeesModal({
  isOpen,
  onClose,
  data,
  isLoading,
  search,
  onSearchChange,
}: EventAttendeesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl! p-0 overflow-hidden">
        <DialogHeader className="p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <div>
              <DialogTitle className="text-base font-semibold">
                Event Attendees: {data?.event.title ?? "Loading..."}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                List of registered attendees who have completed ticket payment
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 border-b border-border bg-background">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by attendee name or email..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="p-0">
          <SimpleBar style={{ maxHeight: 420 }}>
            <Table>
              <TableHeader className="bg-muted/40 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Attendee</TableHead>
                  <TableHead className="text-xs font-semibold">Transaction</TableHead>
                  <TableHead className="text-xs font-semibold">Tickets</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Total Paid</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-xs text-muted-foreground"
                    >
                      Loading attendees list...
                    </TableCell>
                  </TableRow>
                ) : !data || data.attendees.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-xs text-muted-foreground"
                    >
                      No attendees found for this event.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.attendees.map((attendee) => (
                    <TableRow key={attendee.transactionId} className="text-xs hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarImage src={attendee.avatarUrl ?? undefined} />
                            <AvatarFallback className="text-[10px]">
                              {attendee.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{attendee.name}</span>
                            <span className="text-[11px] text-muted-foreground">
                              {attendee.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {attendee.transactionCode}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {attendee.tickets.map((t, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                              <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[10px] font-normal"
                              >
                                {t.quantity}x
                              </Badge>
                              <span>{t.name}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        Rp {attendee.totalPaidIdr.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(attendee.purchaseDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </SimpleBar>
        </div>

        <div className="p-3 border-t border-border flex justify-between items-center bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Total {data?.meta.totalCount ?? 0} attendees
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
