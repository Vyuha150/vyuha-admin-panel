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
import { Course } from "./columns";

interface CourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (course: Partial<Course>, file?: File | null) => void;
  initialData?: Course | null;
}

export function CourseModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: CourseModalProps) {
  const [form, setForm] = useState({
    title: "",
    instructor: "",
    instructorPhoto: "",
    coursePhoto: "",
    description: "",
    details: "",
    prerequisites: "",
    learningObjectives: "",
    assessments: "",
    price: "",
    format: "",
    level: "",
    duration: "",
    rating: "",
    reviews: "",
    enrollLink: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        prerequisites: Array.isArray(initialData.prerequisites)
          ? initialData.prerequisites.join(", ")
          : initialData.prerequisites || "",
        learningObjectives: Array.isArray(initialData.learningObjectives)
          ? initialData.learningObjectives.join(", ")
          : initialData.learningObjectives || "",
      });
      setFile(null);
    } else {
      setForm({
        title: "",
        instructor: "",
        instructorPhoto: "",
        coursePhoto: "",
        description: "",
        details: "",
        prerequisites: "",
        learningObjectives: "",
        assessments: "",
        price: "",
        format: "",
        level: "",
        duration: "",
        rating: "",
        reviews: "",
        enrollLink: "",
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
        prerequisites: form.prerequisites
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        learningObjectives: form.learningObjectives
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
        className="max-w-3xl"
        style={{ height: "80vh", maxHeight: "80vh", overflow: "hidden" }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Course" : "Add Course"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 py-2 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
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
            <label className="w-40 font-medium" htmlFor="instructor">
              Instructor
            </label>
            <Input
              id="instructor"
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="resize-none w-full h-24 p-2 border rounded-md"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="details">
              Details
            </label>
            <textarea
              id="details"
              name="details"
              value={form.details}
              onChange={handleChange}
              required
              className="resize-none w-full h-24 p-2 border rounded-md"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="prerequisites">
              Prerequisites
            </label>
            <Input
              id="prerequisites"
              name="prerequisites"
              value={form.prerequisites}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="learningObjectives">
              Learning Objectives
            </label>
            <Input
              id="learningObjectives"
              name="learningObjectives"
              value={form.learningObjectives}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="assessments">
              Assessments
            </label>
            <Input
              id="assessments"
              name="assessments"
              value={form.assessments}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="price">
              Price
            </label>
            <Input
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="format">
              Format
            </label>
            <Input
              id="format"
              name="format"
              value={form.format}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="level">
              Level
            </label>
            <Input
              id="level"
              name="level"
              value={form.level}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="duration">
              Duration
            </label>
            <Input
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="rating">
              Rating
            </label>
            <Input
              id="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="reviews">
              Reviews
            </label>
            <Input
              id="reviews"
              name="reviews"
              value={form.reviews}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="enrollLink">
              Enroll Link
            </label>
            <Input
              id="enrollLink"
              name="enrollLink"
              value={form.enrollLink}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="coursePhoto">
              Course Photo
            </label>
            <Input
              id="coursePhoto"
              name="coursePhoto"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
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
