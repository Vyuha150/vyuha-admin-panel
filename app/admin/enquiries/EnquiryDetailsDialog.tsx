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
import { Mail } from "lucide-react";
import { Enquiry } from "./columns";

interface EnquiryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiry: Enquiry | null;
  onReply?: (enquiry: Enquiry) => void;
  onDelete?: (enquiry: Enquiry) => void;
  onInProgress?: (enquiry: Enquiry) => void; // <-- add this
}

export function EnquiryDetailsDialog({
  open,
  onOpenChange,
  enquiry,
  onReply,
  onDelete,
  onInProgress, // <-- add this
}: EnquiryDetailsDialogProps) {
  if (!enquiry) return null;

  // Status badge logic
  let statusLabel = "New";
  let statusColor = "bg-yellow-100 text-yellow-800";
  if (enquiry.status === "in-progress") {
    statusLabel = "In Progress";
    statusColor = "bg-blue-100 text-blue-800";
  } else if (enquiry.status === "resolved") {
    statusLabel = "Resolved";
    statusColor = "bg-green-100 text-green-800";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{enquiry.name}</span>
            <Badge variant="secondary">{enquiry.email}</Badge>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
            >
              {statusLabel}
            </span>
          </DialogTitle>
          <DialogDescription>
            Review the enquiry details below. You can reply or delete this
            enquiry.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Subject</span>
            <span className="font-medium">{enquiry.subject}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Message</span>
            <span className="font-medium whitespace-pre-line">
              {enquiry.message}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Received At</span>
            <span className="font-medium">
              {new Date(
                enquiry.submittedAt ?? enquiry.submittedAt
              ).toLocaleString()}
            </span>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          {onInProgress && enquiry.status === "new" && (
            <Button variant="secondary" onClick={() => onInProgress(enquiry)}>
              Mark as In Progress
            </Button>
          )}
          {onReply && enquiry.status !== "resolved" && (
            <Button
              variant="default"
              onClick={() => onReply(enquiry)}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {enquiry.status === "in-progress" ? "Mark as Resolved" : "Reply"}
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" onClick={() => onDelete(enquiry)}>
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
