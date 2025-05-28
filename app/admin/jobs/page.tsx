"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { columns as baseColumns, Job } from "./columns";
import { JobModal } from "./JobModal";
import { JobDetailsDialog } from "./JobDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

export default function JobsAdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/job-application`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJobs(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load jobs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Add or Edit job (with file upload)
  const handleSave = async (job: Partial<Job>, imageFile?: File | null) => {
    const token = Cookies.get("token");
    try {
      const formData = new FormData();
      Object.entries(job).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, value.join(","));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editJob) {
        // Edit
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/job-application/${editJob._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setJobs((prev) =>
          prev.map((j) => (j._id === editJob._id ? res.data : j))
        );
      } else {
        // Add
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/job-application`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setJobs((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
      setEditJob(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to save job. Please try again."
      );
    }
  };

  // Delete job
  const handleDelete = async (job: Job) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-application/${job._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete job. Please try again."
      );
    }
  };

  // View details
  const handleView = (job: Job) => {
    setViewJob(job);
    setDetailsOpen(true);
  };

  // Edit
  const handleEdit = (job: Job) => {
    setEditJob(job);
    setModalOpen(true);
  };

  const columns = baseColumns(handleEdit, handleDelete, handleView);

  // Filter jobs by search (case-insensitive)
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <Button
          onClick={() => {
            setEditJob(null);
            setModalOpen(true);
          }}
        >
          Add Job
        </Button>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <DataTable columns={columns} data={paginatedJobs} />
          {/* Pagination Controls */}
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
      <JobModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        initialData={editJob}
      />
      <JobDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        job={viewJob}
      />
    </div>
  );
}
