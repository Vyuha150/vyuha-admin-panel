import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Building2 } from "lucide-react";
import { Company } from "./CompanyModel";

interface CompanyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
}

export function CompanyDetailsDialog({
  open,
  onOpenChange,
  company,
}: CompanyDetailsDialogProps) {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{company.name}</span>
            <Badge variant="secondary">{company.industry}</Badge>
          </DialogTitle>
          <DialogDescription>
            Company details and contact information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
              {company.logo ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${company.logo}`}
                  alt={company.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 m-3" />
              )}
            </div>
            <div>
              <div className="font-semibold">{company.name}</div>
              <div className="text-sm text-muted-foreground">
                {company.location}
              </div>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Description</span>
            <div className="font-medium">{company.description}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Job Openings</span>
            <div className="font-medium">
              {company.jobOpenings && company.jobOpenings.length > 0
                ? (Array.isArray(company.jobOpenings)
                    ? company.jobOpenings
                    : [company.jobOpenings]
                  ).join(", ")
                : "None"}
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Contact</span>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="font-mono">{company.contact || "N/A"}</span>
              {company.contact && (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2"
                  onClick={() => window.open(`mailto:${company.contact}`)}
                >
                  Email
                </Button>
              )}
            </div>
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
