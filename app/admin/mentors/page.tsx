"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, Mentor } from "./columns";
import { MentorDetailsDialog } from "./MentorDetailsDialog";
import { MentorFormDialog } from "./MentorFormDialog";

const PAGE_SIZE = 10;

export default function MentorsAdminPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [viewMentor, setViewMentor] = useState<Mentor | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editMentor, setEditMentor] = useState<Mentor | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mentors`
        );
        setMentors(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load mentors. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const handleDelete = async (mentor: Mentor) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mentors/admin/${mentor._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMentors((prev) => prev.filter((m) => m._id !== mentor._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete mentor. Please try again."
      );
    }
  };

  const handleView = (mentor: Mentor) => {
    setViewMentor(mentor);
    setDetailsOpen(true);
  };

  // Add Mentor
  const handleAddMentor = async (
    mentor: Partial<Mentor>,
    file?: File | null
  ) => {
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      Object.entries(mentor).forEach(([key, value]) => {
        if (key === "skills" && Array.isArray(value)) {
          formData.append("skills", JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, value as string);
        }
      });
      if (file) formData.append("photo", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mentors/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMentors((prev) => [res.data, ...prev]);
      setFormOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to add mentor. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Edit Mentor
  const handleEditMentor = async (
    mentor: Partial<Mentor>,
    file?: File | null
  ) => {
    if (!editMentor) return;
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      Object.entries(mentor).forEach(([key, value]) => {
        if (key === "skills" && Array.isArray(value)) {
          formData.append("skills", JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, value as string);
        }
      });
      if (file) formData.append("photo", file);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mentors/admin/${editMentor._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMentors((prev) =>
        prev.map((m) => (m._id === editMentor._id ? res.data : m))
      );
      setEditMentor(null);
      setFormOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update mentor. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Open add dialog
  const openAddDialog = () => {
    setEditMentor(null);
    setFormOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (mentor: Mentor) => {
    setEditMentor(mentor);
    setFormOpen(true);
  };

  const filtered = mentors.filter(
    (m) =>
      (m.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (m.industry?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (Array.isArray(m.skills) &&
        m.skills.join(", ").toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mentors</h1>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <a href="/admin/mentors/bookings">View Bookings</a>
          </Button>
          <Button onClick={openAddDialog}>Add Mentor</Button>
        </div>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search by name, industry, or skill..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <DataTable
            columns={columns(handleView, handleDelete, openEditDialog)}
            data={paginated}
          />
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="self-center">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </>
      )}
      <MentorDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        mentor={viewMentor}
      />
      <MentorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={editMentor ? handleEditMentor : handleAddMentor}
        loading={formLoading}
        initialMentor={editMentor}
        isEdit={!!editMentor}
      />
    </div>
  );
}
