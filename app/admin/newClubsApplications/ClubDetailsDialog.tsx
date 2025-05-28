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
import { Club } from "./columns";
import { Download } from "lucide-react";

interface ClubDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  club: Club | null;
  onAccept: (club: Club) => void;
  onReject: (club: Club) => void;
}

export function ClubDetailsDialog({
  open,
  onOpenChange,
  club,
  onAccept,
  onReject,
}: ClubDetailsDialogProps) {
  if (!club) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{club.clubName}</span>
            <Badge variant="secondary">{club.collegeName}</Badge>
          </DialogTitle>
          <DialogDescription>
            Review the club application details below. You can accept or reject
            this application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Phone</span>
            <span className="font-medium">{club.phone}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Vision</span>
            <span className="font-medium">{club.vision}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Document</span>
            {club.document ? (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/${club.document}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Download className="w-4 h-4" />
                {club.document}
              </a>
            ) : (
              <span className="text-muted-foreground">
                No document uploaded
              </span>
            )}
          </div>
          {club.status && (
            <Badge
              variant={
                club.status === "accepted"
                  ? "default"
                  : club.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
            </Badge>
          )}
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button variant="default" onClick={() => onAccept(club)}>
            Accept
          </Button>
          <Button variant="destructive" onClick={() => onReject(club)}>
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
