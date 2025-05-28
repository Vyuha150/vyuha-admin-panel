// CompanyModal.tsx
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

// Define the Company type for props
export interface Company {
  _id?: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  description: string;
  jobOpenings: string[];
  contact?: string;
}

interface CompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (company: Partial<Company> | FormData) => void;
  initialData?: Company | null;
}

export function CompanyModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: CompanyModalProps) {
  const [form, setForm] = useState<
    Omit<Company, "id" | "jobOpenings"> & { jobOpenings: string }
  >({
    name: "",
    logo: "",
    industry: "",
    location: "",
    description: "",
    jobOpenings: "",
    contact: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        logo: initialData.logo || "",
        industry: initialData.industry || "",
        location: initialData.location || "",
        description: initialData.description || "",
        contact: initialData.contact || "",
        jobOpenings: Array.isArray(initialData.jobOpenings)
          ? initialData.jobOpenings.join(", ")
          : initialData.jobOpenings || "",
      });
    } else {
      setForm({
        name: "",
        logo: "",
        industry: "",
        location: "",
        description: "",
        jobOpenings: "",
        contact: "",
      });
    }
    setLogoFile(null);
  }, [initialData, open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("industry", form.industry);
    formData.append("location", form.location);
    formData.append("description", form.description);
    formData.append("contact", form.contact || "");
    formData.append(
      "jobOpenings",
      form.jobOpenings
        .split(",")
        .map((j) => j.trim())
        .filter(Boolean)
        .join(",")
    );
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    onSave(formData); // Pass FormData to parent
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Company" : "Add Company"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="name">
              Company Name:
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Company Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="logo">
              Logo
            </label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              required={!initialData}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="industry">
              Industry:
            </label>
            <Input
              id="industry"
              name="industry"
              placeholder="Industry"
              value={form.industry}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="location">
              Location:
            </label>
            <Input
              id="location"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-80 font-medium" htmlFor="contact">
              Contact:
            </label>
            <Input
              id="contact"
              name="contact"
              placeholder="Contact"
              value={form.contact}
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
            <label className="w-80 font-medium" htmlFor="jobOpenings">
              Job Openings (comma separated):
            </label>
            <Input
              id="jobOpenings"
              name="jobOpenings"
              placeholder="Job Openings (comma separated)"
              value={form.jobOpenings}
              onChange={handleChange}
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
