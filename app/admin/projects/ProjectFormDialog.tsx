"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Project } from "./columns";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Partial<Project>, file?: File | null) => void;
  initialData?: Project | null;
  isEdit?: boolean;
  loading?: boolean;
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
  isEdit,
  loading,
}: ProjectFormDialogProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    difficulty: "",
    teamSize: "",
    skills: "",
    goals: "",
    deliverables: "",
    evaluationCriteria: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        deadline: initialData.deadline ? initialData.deadline.slice(0, 10) : "",
        difficulty: initialData.difficulty || "",
        teamSize: initialData.teamSize || "",
        skills: (initialData.skills || []).join(", "),
        goals: (initialData.goals || []).join("\n"),
        deliverables: (initialData.deliverables || []).join("\n"),
        evaluationCriteria: (initialData.evaluationCriteria || []).join("\n"),
      });
      setFile(null);
    } else {
      setForm({
        title: "",
        description: "",
        deadline: "",
        difficulty: "",
        teamSize: "",
        skills: "",
        goals: "",
        deliverables: "",
        evaluationCriteria: "",
      });
      setFile(null);
    }
  }, [initialData, open]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(
      {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        goals: form.goals
          .split("\n")
          .map((g) => g.trim())
          .filter(Boolean),
        deliverables: form.deliverables
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean),
        evaluationCriteria: form.evaluationCriteria
          .split("\n")
          .map((e) => e.trim())
          .filter(Boolean),
      },
      file
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 py-2 overflow-y-auto"
          style={{ maxHeight: "60vh" }}
        >
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="title">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="description">
              Description
            </label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="deadline">
              Deadline
            </label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="difficulty">
              Difficulty
            </label>
            <Input
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="teamSize">
              Team Size
            </label>
            <Input
              id="teamSize"
              name="teamSize"
              value={form.teamSize}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="skills">
              Skills (comma separated)
            </label>
            <Input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-start gap-4">
            <label className="w-40 font-medium pt-2" htmlFor="goals">
              Goals (one per line)
            </label>
            <textarea
              id="goals"
              name="goals"
              value={form.goals}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              rows={3}
              required
            />
          </div>
          <div className="flex items-start gap-4">
            <label className="w-40 font-medium pt-2" htmlFor="deliverables">
              Deliverables (one per line)
            </label>
            <textarea
              id="deliverables"
              name="deliverables"
              value={form.deliverables}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              rows={3}
              required
            />
          </div>
          <div className="flex items-start gap-4">
            <label
              className="w-40 font-medium pt-2"
              htmlFor="evaluationCriteria"
            >
              Evaluation Criteria (one per line)
            </label>
            <textarea
              id="evaluationCriteria"
              name="evaluationCriteria"
              value={form.evaluationCriteria}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              rows={3}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="image">
              Image
            </label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {isEdit ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
