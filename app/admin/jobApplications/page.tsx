"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, JobApplication } from "./columns";
import { JobApplicationDetailsDialog } from "./JobApplicationDetailsDialog";

const PAGE_SIZE = 10;

export default function JobApplicationsAdminPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [viewApp, setViewApp] = useState<JobApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/job-applicants`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load job applications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleDelete = async (app: JobApplication) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-applicants/${app._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) => prev.filter((a) => a._id !== app._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete application. Please try again."
      );
    }
  };

  const handleView = (app: JobApplication) => {
    setViewApp(app);
    setDetailsOpen(true);
  };

  // Accept or reject (status update)
  const handleStatusUpdate = async (app: JobApplication, status: string) => {
    const token = Cookies.get("token");
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-applicants/${app._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((a) => (a._id === app._id ? res.data : a))
      );
      setDetailsOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update status. Please try again."
      );
    }
  };

  const handleAccept = (app: JobApplication) =>
    handleStatusUpdate(app, "accepted");
  const handleReject = (app: JobApplication) =>
    handleStatusUpdate(app, "rejected");

  const filtered = applications.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.jobId && a.jobId.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search by name, email, or job ID..."
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
            columns={columns(handleView, handleDelete)}
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
      <JobApplicationDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        application={viewApp}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
