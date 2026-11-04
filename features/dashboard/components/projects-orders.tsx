"use client";

import { Receipt, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/common/dashboard-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SimpleBar from "simplebar-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TrxStatus =
  | "DONE"
  | "WAITING_FOR_ADMIN_CONFIRMATION"
  | "WAITING_FOR_PAYMENT"
  | "REJECTED"
  | "CANCELED"
  | "EXPIRED";

interface RecentTransaction {
  id: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  ticketQty: number;
  totalPaid: number;
  status: TrxStatus;
  date: string;
}

const statusConfig: Record<
  TrxStatus,
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

const recentTransactions: RecentTransaction[] = [
  {
    id: "TRX-2026-081",
    eventName: "Tech Innovators Summit 2026",
    customerName: "Budi Santoso",
    customerEmail: "budi.santoso@example.com",
    ticketQty: 2,
    totalPaid: 750000,
    status: "WAITING_FOR_ADMIN_CONFIRMATION",
    date: "10 mins ago",
  },
  {
    id: "TRX-2026-080",
    eventName: "Indie Music Fest Jakarta",
    customerName: "Siti Rahma",
    customerEmail: "siti.rahma@example.com",
    ticketQty: 1,
    totalPaid: 250000,
    status: "DONE",
    date: "25 mins ago",
  },
  {
    id: "TRX-2026-079",
    eventName: "UI/UX Masterclass Bandung",
    customerName: "Andi Wijaya",
    customerEmail: "andi.wijaya@example.com",
    ticketQty: 3,
    totalPaid: 1200000,
    status: "DONE",
    date: "1 hour ago",
  },
  {
    id: "TRX-2026-078",
    eventName: "Tech Innovators Summit 2026",
    customerName: "Dewi Lestari",
    customerEmail: "dewi.lestari@example.com",
    ticketQty: 1,
    totalPaid: 375000,
    status: "WAITING_FOR_PAYMENT",
    date: "2 hours ago",
  },
  {
    id: "TRX-2026-077",
    eventName: "National Startup Pitch 2026",
    customerName: "Rian Pratama",
    customerEmail: "rian.pratama@example.com",
    ticketQty: 1,
    totalPaid: 500000,
    status: "REJECTED",
    date: "4 hours ago",
  },
];

export default function ProjectsOrders() {
  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Receipt size={16} className="text-primary" />
          <span>Recent Transactions & Attendees</span>
        </CardTitle>
        <Link href="/organizer/transactions">
          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary">
            View All Transactions →
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="px-0!">
        <SimpleBar>
          <div className="overflow-x-auto min-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="pl-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Trx ID & Event
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                    Tickets
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Paid
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentTransactions.map((trx) => {
                  const cfg = statusConfig[trx.status];
                  return (
                    <TableRow key={trx.id} className="border-border hover:bg-muted/40">
                      <TableCell className="pl-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-sm">{trx.id}</span>
                          <span className="text-xs text-muted-foreground">{trx.eventName}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">
                            {trx.customerName}
                          </span>
                          <span className="text-xs text-muted-foreground">{trx.customerEmail}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 text-center">
                        <span className="inline-flex items-center justify-center font-semibold text-sm">
                          {trx.ticketQty}
                        </span>
                      </TableCell>

                      <TableCell className="py-3">
                        <span className="font-semibold text-foreground text-sm">
                          Rp {trx.totalPaid.toLocaleString("id-ID")}
                        </span>
                      </TableCell>

                      <TableCell className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                      </TableCell>

                      <TableCell className="pr-4 py-3 text-right text-xs text-muted-foreground">
                        {trx.date}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </SimpleBar>
      </CardContent>
    </DashboardCard>
  );
}
