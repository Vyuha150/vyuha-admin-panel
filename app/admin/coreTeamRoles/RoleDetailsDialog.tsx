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
import { CoreTeamRole } from "./columns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: CoreTeamRole | null;
}

export function CoreTeamRoleDetailsDialog({ open, onOpenChange, role }: Props) {
  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{role.title}</span>
            <Badge variant="secondary">Core Team Role</Badge>
          </DialogTitle>
          <DialogDescription>Review the role details below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <div>
            <span className="text-sm text-muted-foreground">Description:</span>
            <span className="ml-2 font-medium">{role.description}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Responsibilities:
            </span>
            <ul className="ml-6 list-disc">
              {role.responsibilities.map((item, idx) => (
                <li key={idx} className="font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Requirements:</span>
            <ul className="ml-6 list-disc">
              {role.requirements.map((item, idx) => (
                <li key={idx} className="font-medium">
                  {item}
                </li>
              ))}
            </ul>
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
