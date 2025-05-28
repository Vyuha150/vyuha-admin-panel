"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { columns as baseColumns, Enquiry } from "./columns";
import { EnquiryDetailsDialog } from "./EnquiryDetailsDialog";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function ApplicationsPage() {
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState<Enquiry[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch enquiries from backend
  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch {
        setError("Failed to load enquiries");
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  // Handler for viewing details
  const handleView = (enquiry: Enquiry) => {
    setSelected(enquiry);
    setDialogOpen(true);
  };

  // Handler for reply (update status to "resolved" or "in-progress")
  const handleReply = async (enquiry: Enquiry) => {
    window.open(`mailto:${enquiry.email}?subject=Re: ${enquiry.subject}`);
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${enquiry._id}/status`,
        { status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) =>
        prev.map((e) =>
          e._id === enquiry._id ? { ...e, status: "resolved" } : e
        )
      );
    } catch {
      alert("Failed to update status.");
    }
  };

  // Handler for in-progress (update status to "in-progress")
  const handleInProgress = async (enquiry: Enquiry) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${enquiry._id}/status`,
        { status: "in-progress" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) =>
        prev.map((e) =>
          e._id === enquiry._id ? { ...e, status: "in-progress" } : e
        )
      );
    } catch {
      alert("Failed to update status.");
    }
  };

  // Handler for delete
  const handleDelete = async (enquiry: Enquiry) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?"))
      return;
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${enquiry._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => prev.filter((e) => e._id !== enquiry._id));
    } catch {
      alert("Failed to delete enquiry.");
    }
  };

  // Pass handlers to columns
  const columns = baseColumns(handleView, handleReply, handleDelete);

  // Pagination logic
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginatedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Enquiries from Contact Page
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage contact enquiries.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={paginatedData}
        searchColumn="name"
        searchPlaceholder="Search applications..."
      />
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
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

      <EnquiryDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        enquiry={selected}
        onReply={handleReply}
        onDelete={handleDelete}
        onInProgress={handleInProgress}
      />
    </div>
  );
}
