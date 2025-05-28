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
import { User } from "./columns";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl"
        style={{ height: "80vh", maxHeight: "80vh", overflow: "hidden" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{user.name}</span>
            {user.role && (
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            User details and profile information
          </DialogDescription>
        </DialogHeader>
        <div
          className="space-y-4 py-2 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-32 h-32 object-cover rounded border"
            />
          )}
          <div>
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="ml-2 font-medium">{user.email}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Phone:</span>
            <span className="ml-2 font-medium">{user.phone || "-"}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Address:</span>
            <span className="ml-2 font-medium">{user.address || "-"}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Date of Birth:
            </span>
            <span className="ml-2 font-medium">
              {user.dob ? new Date(user.dob).toLocaleDateString() : "-"}
            </span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Gender:</span>
            <span className="ml-2 font-medium">{user.gender || "-"}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Role:</span>
            <span className="ml-2 font-medium capitalize">
              {user.role || "-"}
            </span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Created At:</span>
            <span className="ml-2 font-medium">
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
            </span>
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
