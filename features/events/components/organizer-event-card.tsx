import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { DashboardCard } from "@/components/common/dashboard-card";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
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
    <DashboardCard className="overflow-hidden flex flex-col justify-between">
      <div>
        {event.bannerUrl && (
          <div className="relative w-full h-36 bg-muted">
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className={`${status.bg} ${status.text} border text-[11px] font-medium backdrop-blur-md`}
              >
                {status.label}
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-md text-[10px]">
                {event.category.name}
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h4
              className="text-base font-semibold text-foreground line-clamp-1"
              title={event.title}
            >
              {event.title}
            </h4>
            {!event.bannerUrl && (
              <Badge
                variant="secondary"
                className={`${status.bg} ${status.text} border text-[11px]`}
              >
                {status.label}
              </Badge>
            )}
          </div>
          {event.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
          )}
        </CardHeader>

        <CardContent className="px-4 py-2 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span className="truncate">
                {event.location}, {event.city}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary shrink-0" />
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

          <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-medium text-foreground">Ticket Sales</span>
              <span className="text-muted-foreground font-semibold">
                {event.ticketsSold} / {event.totalCapacity} ({percentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-4 pt-2 border-t border-border flex items-center justify-between">
        <div className="text-[11px] text-muted-foreground">
          {event.ticketTypes.length} ticket tiers
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs"
          onClick={() => onViewAttendees(event.id)}
        >
          <Users className="size-3.5 text-primary" />
          <span>View Attendees</span>
        </Button>
      </div>
    </DashboardCard>
  );
}
