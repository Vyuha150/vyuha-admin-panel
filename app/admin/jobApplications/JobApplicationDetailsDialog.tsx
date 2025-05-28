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
import { JobApplication } from "./columns";

interface JobApplicationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: JobApplication | null;
  onAccept: (app: JobApplication) => void;
  onReject: (app: JobApplication) => void;
}

export function JobApplicationDetailsDialog({
  open,
  onOpenChange,
  application,
  onAccept,
  onReject,
}: JobApplicationDetailsDialogProps) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{application.name}</span>
            <Badge variant="secondary">{application.email}</Badge>
          </DialogTitle>
          <DialogDescription>
            Review the job application details below. You can accept or reject
            this application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Job ID</span>
            <span className="font-medium">{application.jobId}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Cover Letter</span>
            <span className="font-medium whitespace-pre-line">
              {application.coverLetter || (
                <span className="text-muted-foreground">No cover letter</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Resume</span>
            {application.resume ? (
              <a
                href={`${
                  process.env.NEXT_PUBLIC_API_URL
                }/${application.resume.replace(/^\//, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            ) : (
              <span className="text-muted-foreground">No resume uploaded</span>
            )}
          </div>
          {application.status && (
            <Badge
              variant={
                application.status === "accepted"
                  ? "default"
                  : application.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {application.status.charAt(0).toUpperCase() +
                application.status.slice(1)}
            </Badge>
          )}
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button variant="default" onClick={() => onAccept(application)}>
            Accept
          </Button>
          <Button variant="destructive" onClick={() => onReject(application)}>
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
