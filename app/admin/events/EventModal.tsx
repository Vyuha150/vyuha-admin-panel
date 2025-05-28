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
import { Event } from "./columns";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    event: Partial<Event>,
    imageFile: File | null,
    logoFile: File | null
  ) => void;
  initialData?: Event | null;
}

export function EventModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: EventModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    organizerBio: "",
    platformLink: "",
    fees: "",
    materials: "",
    isRecorded: false,
    category: "",
    mode: "",
    targetAudience: "",
    logo: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        date: initialData.date || "",
        time: initialData.time || "",
        location: initialData.location || "",
        organizer: initialData.organizer || "",
        organizerBio: initialData.organizerBio || "",
        platformLink: initialData.platformLink || "",
        fees: initialData.fees || "",
        materials: initialData.materials || "",
        isRecorded: !!initialData.isRecorded,
        category: initialData.category || "",
        mode: initialData.mode || "",
        targetAudience: initialData.targetAudience || "",
        logo: initialData.logo || "",
      });
      setImageFile(null); // Reset file input on edit
      setLogoFile(null);
    } else {
      setForm({
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
        organizer: "",
        organizerBio: "",
        platformLink: "",
        fees: "",
        materials: "",
        isRecorded: false,
        category: "",
        mode: "",
        targetAudience: "",
        logo: "",
      });
      setImageFile(null);
      setLogoFile(null);
    }
  }, [initialData, open]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.name === "image") setImageFile(e.target.files[0]);
      if (e.target.name === "logo") setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form, imageFile, logoFile); // Pass both files as an object, or update your onSave signature to accept both
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl"
        style={{ height: "80vh", maxHeight: "80vh", overflow: "hidden" }}
      >
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Event" : "Add Event"}</DialogTitle>
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
            <label className="w-40 font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full h-24 p-2 border rounded"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="date">
              Date
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="time">
              Time
            </label>
            <Input
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="location">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="organizer">
              Organizer
            </label>
            <Input
              id="organizer"
              name="organizer"
              value={form.organizer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="organizerBio">
              Organizer Bio
            </label>
            <textarea
              id="organizerBio"
              name="organizerBio"
              value={form.organizerBio}
              onChange={handleChange}
              required
              className="w-full h-24 p-2 border rounded"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="platformLink">
              Platform Link
            </label>
            <Input
              id="platformLink"
              name="platformLink"
              value={form.platformLink}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="fees">
              Fees
            </label>
            <Input
              id="fees"
              name="fees"
              value={form.fees}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="materials">
              Materials
            </label>
            <Input
              id="materials"
              name="materials"
              value={form.materials}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="isRecorded">
              Is Recorded
            </label>
            <Input
              id="isRecorded"
              name="isRecorded"
              type="checkbox"
              checked={form.isRecorded}
              onChange={handleChange}
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
          {/* Logo file input */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="logo">
              Logo
            </label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {initialData?.logo && !logoFile && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${initialData.logo}`}
                alt="Current Logo"
                className="h-12 rounded border ml-2"
              />
            )}
            {logoFile && (
              <span className="ml-2 text-xs text-muted-foreground">
                {logoFile.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="category">
              Category
            </label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="mode">
              Mode
            </label>
            <Input
              id="mode"
              name="mode"
              value={form.mode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="targetAudience">
              Target Audience
            </label>
            <Input
              id="targetAudience"
              name="targetAudience"
              value={form.targetAudience}
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
