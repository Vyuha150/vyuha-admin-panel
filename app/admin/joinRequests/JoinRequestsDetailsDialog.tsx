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
import { Organization } from "./columns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
}

export function JoinRequestsDetailsDialog({
  open,
  onOpenChange,
  organization,
}: Props) {
  if (!organization) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl"
        style={{ height: "80vh", maxHeight: "80vh", overflow: "hidden" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{organization.name}</span>
            <Badge variant="secondary">
              {organization.registerAs === "individual"
                ? "Individual"
                : "Organization"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {organization.organizationType || organization.collegeUniversity}
          </DialogDescription>
        </DialogHeader>
        <div
          className="space-y-4 py-2 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          {organization.logo && (
            <img
              src={`${
                process.env.NEXT_PUBLIC_API_URL
              }/${organization.logo.replace(/^\//, "")}`}
              alt={organization.name}
              className="w-32 h-32 object-cover rounded border"
            />
          )}
          <div>
            <span className="text-sm text-muted-foreground">
              Contact Email:
            </span>
            <span className="ml-2 font-medium">
              {organization.contactEmail}
            </span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Contact Phone:
            </span>
            <span className="ml-2 font-medium">
              {organization.contactPhone}
            </span>
          </div>
          {organization.registerAs === "organization" && (
            <>
              <div>
                <span className="text-sm text-muted-foreground">
                  Organization Type:
                </span>
                <span className="ml-2 font-medium">
                  {organization.organizationType}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Active Members:
                </span>
                <span className="ml-2 font-medium">
                  {organization.activeMembers}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Past Events:
                </span>
                <span className="ml-2 font-medium">
                  {organization.pastEvents}
                </span>
              </div>
            </>
          )}
          {organization.registerAs === "individual" && (
            <div>
              <span className="text-sm text-muted-foreground">
                College/University:
              </span>
              <span className="ml-2 font-medium">
                {organization.collegeUniversity}
              </span>
            </div>
          )}
          <div>
            <span className="text-sm text-muted-foreground">Created At:</span>
            <span className="ml-2 font-medium">
              {organization.createdAt
                ? new Date(organization.createdAt).toLocaleString()
                : "-"}
            </span>
          </div>
          {/* Add more fields here if needed */}
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
