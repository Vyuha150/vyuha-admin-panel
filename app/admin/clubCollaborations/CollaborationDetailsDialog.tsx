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
import { Download } from "lucide-react";
import { Collaboration } from "./columns";

interface CollaborationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboration: Collaboration | null;
  onAccept: (collab: Collaboration) => void;
  onReject: (collab: Collaboration) => void;
}

export function CollaborationDetailsDialog({
  open,
  onOpenChange,
  collaboration,
  onAccept,
  onReject,
}: CollaborationDetailsDialogProps) {
  if (!collaboration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{collaboration.clubName}</span>
            <Badge variant="secondary">{collaboration.collegeName}</Badge>
          </DialogTitle>
          <DialogDescription>
            Review the collaboration request details below. You can accept or
            reject this request.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Phone</span>
            <span className="font-medium">{collaboration.phone}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Collaboration Details
            </span>
            <span className="font-medium">
              {collaboration.collaborationDetails}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Document</span>
            {collaboration.document ? (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/${collaboration.document}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Download className="w-4 h-4" />
                {collaboration.document}
              </a>
            ) : (
              <span className="text-muted-foreground">
                No document uploaded
              </span>
            )}
          </div>
          {collaboration.status && (
            <Badge
              variant={
                collaboration.status === "accepted"
                  ? "default"
                  : collaboration.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {collaboration.status.charAt(0).toUpperCase() +
                collaboration.status.slice(1)}
            </Badge>
          )}
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button variant="default" onClick={() => onAccept(collaboration)}>
            Accept
          </Button>
          <Button variant="destructive" onClick={() => onReject(collaboration)}>
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
