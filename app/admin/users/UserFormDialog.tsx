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
import { User } from "./columns";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: Partial<User>) => void;
  initialData?: User | null;
  isEdit?: boolean;
  loading?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
  isEdit,
  loading,
}: UserFormDialogProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    role: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        dob: initialData.dob || "",
        gender: initialData.gender || "",
        role: initialData.role || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        role: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
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
            <label className="w-40 font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="phone">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="address">
              Address
            </label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="dob">
              Date of Birth
            </label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="gender">
              Gender
            </label>
            <Input
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 font-medium" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-2 py-2"
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="sub-admin">Sub-admin</option>
            </select>
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
