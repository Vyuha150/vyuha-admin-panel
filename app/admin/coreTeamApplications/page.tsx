"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { columns as baseColumns, CoreTeamApplication } from "./columns";
import { CoreTeamApplicationDetailsDialog } from "./CoreTeamApplicationDetailsDialog";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function CoreTeamApplicationsPage() {
  const [selected, setSelected] = useState<CoreTeamApplication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState<CoreTeamApplication[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-application`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
        console.log("Fetched applications:", res.data);
      } catch {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleView = (application: CoreTeamApplication) => {
    setSelected(application);
    setDialogOpen(true);
  };

  const handleContact = (application: CoreTeamApplication) => {
    window.open(`mailto:${application.email}`);
  };

  const handleDelete = async (application: CoreTeamApplication) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-application/${application._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => prev.filter((app) => app._id !== application._id));
      if (selected?._id === application._id) {
        setDialogOpen(false);
        setSelected(null);
      }
    } catch {
      alert("Failed to delete application.");
    }
  };

  const handleAccept = async (application: CoreTeamApplication) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-application/${application._id}/status`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) =>
        prev.map((app) =>
          app._id === application._id ? { ...app, status: "approved" } : app
        )
      );
      setSelected((app) => (app ? { ...app, status: "approved" } : app));
    } catch {
      alert("Failed to approve application.");
    }
  };

  const handleReject = async (application: CoreTeamApplication) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-application/${application._id}/status`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) =>
        prev.map((app) =>
          app._id === application._id ? { ...app, status: "rejected" } : app
        )
      );
      setSelected((app) => (app ? { ...app, status: "rejected" } : app));
    } catch {
      alert("Failed to reject application.");
    }
  };

  const columns = baseColumns(handleView, handleContact, handleDelete);

  // Pagination logic
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginatedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Core Team Applications
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage core team applications.
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

      <CoreTeamApplicationDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={selected}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
