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
import { Membership } from "./columns";

interface MembershipDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membership: Membership | null;
}

export function MembershipDetailsDialog({
  open,
  onOpenChange,
  membership,
}: MembershipDetailsDialogProps) {
  if (!membership) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{membership.fullName}</span>
          </DialogTitle>
          <DialogDescription>Membership application details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <div>
            <span className="font-semibold">Email:</span> {membership.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {membership.phone}
          </div>
          <div>
            <span className="font-semibold">Address:</span> {membership.address}
          </div>
          <div>
            <span className="font-semibold">Organization:</span>{" "}
            {membership.organization}
          </div>
          <div>
            <span className="font-semibold">Membership Type:</span>{" "}
            {membership.membershipType}
          </div>
          {membership.occupation && (
            <div>
              <span className="font-semibold">Occupation:</span>{" "}
              {membership.occupation}
            </div>
          )}
          {membership.linkedinProfile && (
            <div>
              <span className="font-semibold">LinkedIn:</span>{" "}
              <a
                href={membership.linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {membership.linkedinProfile}
              </a>
            </div>
          )}
          {membership.interests &&
          Array.isArray(membership.interests) &&
          membership.interests.length > 0 ? (
            <div>
              <span className="font-semibold">Interests:</span>{" "}
              {membership.interests.join(", ")}
            </div>
          ) : membership.interests &&
            typeof membership.interests === "string" ? (
            <div>
              <span className="font-semibold">Interests:</span>{" "}
              {membership.interests}
            </div>
          ) : null}
          <div>
            <span className="font-semibold">Payment Status:</span>{" "}
            <span
              className={
                membership.paymentStatus === "completed"
                  ? "text-green-600"
                  : "text-yellow-600"
              }
            >
              {membership.paymentStatus.charAt(0).toUpperCase() +
                membership.paymentStatus.slice(1)}
            </span>
          </div>
          {membership.paymentId && (
            <div>
              <span className="font-semibold">Payment ID:</span>{" "}
              {membership.paymentId}
            </div>
          )}
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
