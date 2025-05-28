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
import { Job } from "./columns";
import Image from "next/image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

export function JobDetailsDialog({ open, onOpenChange, job }: Props) {
  if (!job) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl flex flex-col"
        style={{ height: "80vh", maxHeight: "80vh", overflow: "hidden" }}
      >
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            {job.image && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${job.image}`}
                alt="Job Image"
                width={48}
                height={48}
                className="rounded bg-white border"
              />
            )}
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl font-bold">{job.title}</span>
              <Badge variant="secondary">Job</Badge>
            </DialogTitle>
          </div>
          <DialogDescription>{job.description}</DialogDescription>
        </DialogHeader>
        {/* Scrollable content area */}
        <div className="space-y-4 py-2 overflow-y-auto flex-1 min-h-0">
          <div>
            <span className="text-sm text-muted-foreground">Company:</span>
            <span className="ml-2 font-medium">{job.company}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Location:</span>
            <span className="ml-2 font-medium">{job.location}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Type:</span>
            <span className="ml-2 font-medium">{job.jobType}</span>
          </div>
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">
                Responsibilities:
              </span>
              <ul className="ml-6 list-disc">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="font-medium">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">
                Qualifications:
              </span>
              <ul className="ml-6 list-disc">
                {job.qualifications.map((q, i) => (
                  <li key={i} className="font-medium">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
