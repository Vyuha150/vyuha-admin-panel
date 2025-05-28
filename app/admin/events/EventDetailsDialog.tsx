"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "./columns";
import Image from "next/image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

export function EventDetailsDialog({ open, onOpenChange, event }: Props) {
  if (!event) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl flex flex-col"
        style={{ height: "80vh", maxHeight: "80vh", overflow: "hidden" }}
      >
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            {event.logo && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${event.logo}`}
                alt="Event Logo"
                width={48}
                height={48}
                className="rounded bg-white border"
              />
            )}
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl font-bold">{event.name}</span>
              <Badge variant="secondary">Event</Badge>
            </DialogTitle>
          </div>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>
        {/* Move image inside the scrollable area */}
        <div className="space-y-4 py-2 overflow-y-auto flex-1 min-h-0">
          {event.image && (
            <div className="mb-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${event.image}`}
                alt="Event Image"
                width={500}
                height={50}
                className="rounded h-[200px] object-cover border"
              />
            </div>
          )}
          {/* Scrollable content area */}
          <div className="space-y-4 py-2 overflow-y-auto flex-1 min-h-0">
            <div>
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="ml-2 font-medium">{event.date}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Time:</span>
              <span className="ml-2 font-medium">{event.time}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Location:</span>
              <span className="ml-2 font-medium">{event.location}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Organizer:</span>
              <span className="ml-2 font-medium">{event.organizer}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Organizer Bio:
              </span>
              <span className="ml-2 font-medium">{event.organizerBio}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Platform Link:
              </span>
              <span className="ml-2 font-medium">{event.platformLink}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Fees:</span>
              <span className="ml-2 font-medium">{event.fees}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Materials:</span>
              <span className="ml-2 font-medium">{event.materials}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Is Recorded:
              </span>
              <span className="ml-2 font-medium">
                {event.isRecorded ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Category:</span>
              <span className="ml-2 font-medium">{event.category}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Mode:</span>
              <span className="ml-2 font-medium">{event.mode}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Target Audience:
              </span>
              <span className="ml-2 font-medium">{event.targetAudience}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
