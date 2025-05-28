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
import { Mentor } from "./columns";

interface MentorDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentor: Mentor | null;
}

export function MentorDetailsDialog({
  open,
  onOpenChange,
  mentor,
}: MentorDetailsDialogProps) {
  if (!mentor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{mentor.name}</span>
          </DialogTitle>
          <DialogDescription>Mentor details and profile.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {mentor.photo && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${mentor.photo}`}
              alt={mentor.name}
              className="w-24 h-24 object-cover rounded mb-2"
            />
          )}
          <div>
            <span className="font-semibold">Industry:</span> {mentor.industry}
          </div>
          <div>
            <span className="font-semibold">Experience:</span>{" "}
            {mentor.experience}
          </div>
          <div>
            <span className="font-semibold">Mentorship Style:</span>{" "}
            {mentor.mentorshipStyle}
          </div>
          <div>
            <span className="font-semibold">Availability:</span>{" "}
            {mentor.availability}
          </div>
          <div>
            <span className="font-semibold">Skills:</span>{" "}
            {(mentor.skills || []).join(", ")}
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
