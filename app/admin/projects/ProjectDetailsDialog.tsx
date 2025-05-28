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
import { Project } from "./columns";

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export function ProjectDetailsDialog({
  open,
  onOpenChange,
  project,
}: ProjectDetailsDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>Project details</DialogDescription>
        </DialogHeader>
        <div
          className="space-y-2 py-2 overflow-y-auto"
          style={{ maxHeight: "60vh" }}
        >
          {project.image && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/${project.image.replace(
                /^\//,
                ""
              )}`}
              alt={project.title}
              className="w-48 h-32 object-cover rounded border mb-2"
            />
          )}
          <div>
            <span className="font-semibold">Description:</span>{" "}
            {project.description}
          </div>
          <div>
            <span className="font-semibold">Deadline:</span>{" "}
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString()
              : "-"}
          </div>
          <div>
            <span className="font-semibold">Difficulty:</span>{" "}
            {project.difficulty}
          </div>
          <div>
            <span className="font-semibold">Team Size:</span> {project.teamSize}
          </div>
          <div>
            <span className="font-semibold">Skills:</span>{" "}
            {(project.skills || []).join(", ")}
          </div>
          <div>
            <span className="font-semibold">Goals:</span>
            <ul className="list-disc ml-6">
              {(project.goals || []).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold">Deliverables:</span>
            <ul className="list-disc ml-6">
              {(project.deliverables || []).map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold">Evaluation Criteria:</span>
            <ul className="list-disc ml-6">
              {(project.evaluationCriteria || []).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold">Created At:</span>{" "}
            {project.createdAt
              ? new Date(project.createdAt).toLocaleString()
              : "-"}
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
