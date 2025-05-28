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
import { CoreTeamApplication } from "./columns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: CoreTeamApplication | null;
  onAccept: (app: CoreTeamApplication) => void;
  onReject: (app: CoreTeamApplication) => void;
}

export function CoreTeamApplicationDetailsDialog({
  open,
  onOpenChange,
  application,
  onAccept,
  onReject,
}: Props) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{application.name}</span>
            <Badge
              variant={
                application.status === "approved"
                  ? "default"
                  : application.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {application.status
                ? application.status.charAt(0).toUpperCase() +
                  application.status.slice(1)
                : "Pending"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Review the application details below. You can accept or reject this
            application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <div>
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="ml-2 font-medium">{application.email}</span>
          </div>
          {application.phone && (
            <div>
              <span className="text-sm text-muted-foreground">Phone:</span>
              <span className="ml-2 font-medium">{application.phone}</span>
            </div>
          )}
          <div>
            <span className="text-sm text-muted-foreground">Applied At:</span>
            <span className="ml-2 font-medium">
              {(() => {
                const rawDate = application.appliedAt || application.createdAt;
                const date = rawDate ? new Date(rawDate) : null;
                return date && !isNaN(date.getTime())
                  ? date.toLocaleString()
                  : "-";
              })()}
            </span>
          </div>
          {/* Add more fields as needed */}
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button
            variant="default"
            onClick={() => onAccept(application)}
            disabled={application.status === "approved"}
          >
            Accept
          </Button>
          <Button
            variant="destructive"
            onClick={() => onReject(application)}
            disabled={application.status === "rejected"}
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
