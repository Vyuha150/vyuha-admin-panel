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
import { PodcastPartner } from "./columns";

interface PodcastPartnerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: PodcastPartner | null;
}

export function PodcastPartnerDetailsDialog({
  open,
  onOpenChange,
  partner,
}: PodcastPartnerDetailsDialogProps) {
  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {partner.name}
            <span className="ml-2 text-xs text-muted-foreground">
              ({partner.partnerType})
            </span>
          </DialogTitle>
          <DialogDescription>Podcast Partner Form Details</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <div>
            <span className="font-semibold">Phone:</span> {partner.number}
          </div>
          <div>
            <span className="font-semibold">Partner Type:</span>{" "}
            {partner.partnerType}
          </div>
          <div>
            <span className="font-semibold">Comments:</span> {partner.comments}
          </div>
          {partner.document && (
            <div>
              <span className="font-semibold">Document:</span>{" "}
              <a
                href={`${
                  process.env.NEXT_PUBLIC_API_URL
                }/${partner.document.replace(/^\//, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Download
              </a>
            </div>
          )}
          <div>
            <span className="font-semibold">Submitted At:</span>{" "}
            {partner.createdAt
              ? new Date(partner.createdAt).toLocaleString()
              : "-"}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
