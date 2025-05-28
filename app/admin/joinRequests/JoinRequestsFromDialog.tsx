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
import { Organization } from "./columns";

interface JoinRequestsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (org: Partial<Organization>, file?: File | null) => void;
  initialData?: Organization | null;
  isEdit?: boolean;
  loading?: boolean;
}

export function JoinRequestsFormDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
  isEdit,
  loading,
}: JoinRequestsFormDialogProps) {
  const [form, setForm] = useState({
    registerAs: "organization" as "organization" | "individual",
    name: "",
    organizationType: "",
    activeMembers: "",
    pastEvents: "",
    collegeUniversity: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        registerAs:
          initialData.registerAs === "individual"
            ? "individual"
            : "organization",
        name: initialData.name || "",
        organizationType: initialData.organizationType || "",
        activeMembers: initialData.activeMembers || "",
        pastEvents: initialData.pastEvents || "",
        collegeUniversity: initialData.collegeUniversity || "",
        contactEmail: initialData.contactEmail || "",
        contactPhone: initialData.contactPhone || "",
      });
      setFile(null);
    } else {
      setForm({
        registerAs: "organization",
        name: "",
        organizationType: "",
        activeMembers: "",
        pastEvents: "",
        collegeUniversity: "",
        contactEmail: "",
        contactPhone: "",
      });
      setFile(null);
    }
  }, [initialData, open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form, file);
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
            {isEdit ? "Edit Join Request" : "Add Join Request"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 py-2 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="registerAs">
              Register As
            </label>
            <select
              id="registerAs"
              name="registerAs"
              value={form.registerAs}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="organization">Organization</option>
              <option value="individual">Individual</option>
            </select>
          </div>
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
          {form.registerAs === "organization" && (
            <>
              <div className="flex items-center gap-4">
                <label className="w-40 font-medium" htmlFor="organizationType">
                  Organization Type
                </label>
                <Input
                  id="organizationType"
                  name="organizationType"
                  value={form.organizationType}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 font-medium" htmlFor="activeMembers">
                  Active Members
                </label>
                <Input
                  id="activeMembers"
                  name="activeMembers"
                  value={form.activeMembers}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 font-medium" htmlFor="pastEvents">
                  Past Events
                </label>
                <Input
                  id="pastEvents"
                  name="pastEvents"
                  value={form.pastEvents}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          {form.registerAs === "individual" && (
            <div className="flex items-center gap-4">
              <label className="w-40 font-medium" htmlFor="collegeUniversity">
                College/University
              </label>
              <Input
                id="collegeUniversity"
                name="collegeUniversity"
                value={form.collegeUniversity}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="contactEmail">
              Contact Email
            </label>
            <Input
              id="contactEmail"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="contactPhone">
              Contact Phone
            </label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="logo">
              Logo
            </label>
            <Input
              id="logo"
              name="logo"
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
