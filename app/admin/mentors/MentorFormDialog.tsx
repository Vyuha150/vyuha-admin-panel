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
import { Mentor } from "./columns";

interface MentorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mentor: Partial<Mentor>, file?: File | null) => void;
  initialMentor?: Mentor | null;
  isEdit?: boolean;
  loading?: boolean; // <-- Add this line
}

export function MentorFormDialog({
  open,
  onOpenChange,
  onSave,
  initialMentor,
}: MentorFormDialogProps) {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    experience: "",
    mentorshipStyle: "",
    availability: "",
    skills: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialMentor) {
      setForm({
        name: initialMentor.name || "",
        industry: initialMentor.industry || "",
        experience: initialMentor.experience || "",
        mentorshipStyle: initialMentor.mentorshipStyle || "",
        availability: initialMentor.availability || "",
        skills: Array.isArray(initialMentor.skills)
          ? initialMentor.skills.join(", ")
          : typeof initialMentor.skills === "string"
          ? initialMentor.skills
          : "",
      });
      setFile(null);
    } else {
      setForm({
        name: "",
        industry: "",
        experience: "",
        mentorshipStyle: "",
        availability: "",
        skills: "",
      });
      setFile(null);
    }
  }, [initialMentor, open]);

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
      },
      file
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl"
        style={{ height: "auto", maxHeight: "80vh", overflow: "hidden" }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialMentor ? "Edit Mentor" : "Add Mentor"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 py-2 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="industry">
              Industry
            </label>
            <Input
              id="industry"
              name="industry"
              value={form.industry}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="experience">
              Experience
            </label>
            <Input
              id="experience"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="mentorshipStyle">
              Mentorship Style
            </label>
            <Input
              id="mentorshipStyle"
              name="mentorshipStyle"
              value={form.mentorshipStyle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="availability">
              Availability
            </label>
            <Input
              id="availability"
              name="availability"
              value={form.availability}
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
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="photo">
              Photo
            </label>
            <Input
              id="photo"
              name="photo"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <DialogFooter>
            <Button type="submit">{initialMentor ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
