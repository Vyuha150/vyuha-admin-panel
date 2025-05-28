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

export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  document: string;
  status?: "pending" | "accepted" | "rejected";
}

interface CentralTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onAccept: (member: Member) => void;
  onReject: (member: Member) => void;
}

export function CentralTeamMemberDialog({
  open,
  onOpenChange,
  member,
  onAccept,
  onReject,
}: CentralTeamMemberDialogProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{member.name}</span>
            <Badge variant="secondary">{member.email}</Badge>
          </DialogTitle>
          <DialogDescription>
            Review the central team application details below. You can accept or
            reject this application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Phone</span>
            <span className="font-medium">{member.phone}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Skills</span>
            <span className="font-medium">{member.skills}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Document</span>
            {member.document ? (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/${member.document}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Download className="w-4 h-4" />
                {member.document}
              </a>
            ) : (
              <span className="text-muted-foreground">
                No document uploaded
              </span>
            )}
          </div>
          {member.status && (
            <Badge
              variant={
                member.status === "accepted"
                  ? "default"
                  : member.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </Badge>
          )}
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button variant="default" onClick={() => onAccept(member)}>
            Accept
          </Button>
          <Button variant="destructive" onClick={() => onReject(member)}>
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
