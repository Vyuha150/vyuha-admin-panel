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
import { Job } from "./columns";

interface JobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (job: Partial<Job>, imageFile: File | null) => void;
  initialData?: Job | null;
}

export function JobModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: JobModalProps) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    description: "",
    responsibilities: "",
    qualifications: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        company: initialData.company || "",
        location: initialData.location || "",
        jobType: initialData.jobType || "",
        description: initialData.description || "",
        responsibilities: initialData.responsibilities
          ? initialData.responsibilities.join(", ")
          : "",
        qualifications: initialData.qualifications
          ? initialData.qualifications.join(", ")
          : "",
      });
      setImageFile(null);
    } else {
      setForm({
        title: "",
        company: "",
        location: "",
        jobType: "",
        description: "",
        responsibilities: "",
        qualifications: "",
      });
      setImageFile(null);
    }
  }, [initialData, open]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(
      {
        ...form,
        responsibilities: form.responsibilities
          ? form.responsibilities
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        qualifications: form.qualifications
          ? form.qualifications
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      },
      imageFile
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Job" : "Add Job"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <Input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <Input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            required
          />
          <Input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <Input
            name="jobType"
            placeholder="Job Type"
            value={form.jobType}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <Input
            name="responsibilities"
            placeholder="Responsibilities (comma separated)"
            value={form.responsibilities}
            onChange={handleChange}
          />
          <Input
            name="qualifications"
            placeholder="Qualifications (comma separated)"
            value={form.qualifications}
            onChange={handleChange}
          />
          <div className="flex items-center gap-4">
            <label className="w-32 font-medium" htmlFor="image">
              Image
            </label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {initialData?.image && !imageFile && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${initialData.image}`}
                alt="Current"
                className="h-12 rounded border ml-2"
              />
            )}
            {imageFile && (
              <span className="ml-2 text-xs text-muted-foreground">
                {imageFile.name}
              </span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">{initialData ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
