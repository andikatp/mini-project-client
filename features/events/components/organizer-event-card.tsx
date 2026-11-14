import { DashboardCard } from "@/components/shared-dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Image } from "@/lib/router-compat";
import { Calendar, MapPin, Users } from "lucide-react";
import type { EventStatus, OrganizerEvent } from "../types";

const statusConfig: Record<EventStatus, { label: string; bg: string; text: string }> = {
  PUBLISHED: {
    label: "Published",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  DRAFT: {
    label: "Draft",
    bg: "bg-zinc-500/10",
    text: "text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
  CANCELED: {
    label: "Canceled",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
};

interface OrganizerEventCardProps {
  event: OrganizerEvent;
  onViewAttendees: (eventId: string) => void;
}

export function OrganizerEventCard({ event, onViewAttendees }: OrganizerEventCardProps) {
  const status = statusConfig[event.status] ?? statusConfig.PUBLISHED;
  const percentage =
    event.totalCapacity > 0 ? Math.round((event.ticketsSold / event.totalCapacity) * 100) : 0;

  return (
    <DashboardCard className="border border-border rounded-md overflow-hidden flex flex-col justify-between p-0 gap-0">
      <div>
        {event.bannerUrl && (
          <div className="relative h-44 w-full bg-muted border-b border-border overflow-hidden">
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {event.category?.name || "General"}
            </Badge>
            <Badge className={`text-xs px-2 py-0.5 border ${status.bg} ${status.text}`}>
              {status.label}
            </Badge>
          </div>

          <h3 className="font-semibold text-base line-clamp-1 text-foreground" title={event.title}>
            {event.title}
          </h3>
        </div>

        <CardContent className="px-5 pb-4 space-y-3">
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-foreground shrink-0" />
              <span className="line-clamp-1">
                {event.location}, {event.city}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-foreground shrink-0" />
              <span>
                {new Date(event.startAt).toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="p-3 bg-muted/30 rounded-md border border-border">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-medium text-foreground">Ticket Sales</span>
              <span className="text-muted-foreground font-semibold">
                {event.ticketsSold} / {event.totalCapacity} ({percentage}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-2 border-t border-border flex items-center justify-between">
        <div className="text-[11px] text-muted-foreground">
          {event.ticketTypes.length} ticket tiers
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs rounded-md cursor-pointer"
          onClick={() => onViewAttendees(event.id)}
        >
          <Users className="size-3.5 text-foreground" />
          <span>View Attendees</span>
        </Button>
      </div>
    </DashboardCard>
  );
}
