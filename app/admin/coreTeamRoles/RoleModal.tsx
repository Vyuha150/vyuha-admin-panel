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
import { CoreTeamRole } from "./columns";

interface RoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (role: Partial<CoreTeamRole>) => void;
  initialData?: CoreTeamRole | null;
}

export function RoleModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: RoleModalProps) {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    responsibilities: string;
    requirements: string;
  }>({
    title: "",
    description: "",
    responsibilities: "",
    requirements: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        responsibilities: Array.isArray(initialData.responsibilities)
          ? initialData.responsibilities.join(", ")
          : initialData.responsibilities || "",
        requirements: Array.isArray(initialData.requirements)
          ? initialData.requirements.join(", ")
          : initialData.requirements || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        responsibilities: "",
        requirements: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (initialData) {
      // Only send changed fields
      const changedFields: Partial<CoreTeamRole> = {};
      Object.entries(form).forEach(([key, value]) => {
        const original =
          key === "responsibilities"
            ? Array.isArray(initialData.responsibilities)
              ? initialData.responsibilities.join(", ")
              : initialData.responsibilities || ""
            : key === "requirements"
            ? Array.isArray(initialData.requirements)
              ? initialData.requirements.join(", ")
              : initialData.requirements || ""
            : (initialData as any)[key];
        if (value !== original) {
          if (key === "responsibilities" || key === "requirements") {
            (changedFields as any)[key] = value
              .split(",")
              .map((j) => j.trim())
              .filter(Boolean);
          } else {
            changedFields[key as keyof CoreTeamRole] = value as any;
          }
        }
      });
      onSave(changedFields);
    } else {
      // On add, send all fields
      onSave({
        ...form,
        responsibilities: form.responsibilities
          .split(",")
          .map((j) => j.trim())
          .filter(Boolean),
        requirements: form.requirements
          .split(",")
          .map((j) => j.trim())
          .filter(Boolean),
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Role" : "Add Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="title">
              Title:
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Role Title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="description">
              Description:
            </label>
            <Input
              id="description"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="responsibilities">
              Responsibilities (comma separated):
            </label>
            <Input
              id="responsibilities"
              name="responsibilities"
              placeholder="Responsibilities (comma separated)"
              value={form.responsibilities}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="requirements">
              Requirements (comma separated):
            </label>
            <Input
              id="requirements"
              name="requirements"
              placeholder="Requirements (comma separated)"
              value={form.requirements}
              onChange={handleChange}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">{initialData ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
