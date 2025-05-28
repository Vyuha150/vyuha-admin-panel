"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { columns, Collaboration } from "./columns";
import { CollaborationDetailsDialog } from "./CollaborationDetailsDialog";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function CollaborationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(
    null
  );
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch collaborations from backend
  useEffect(() => {
    const fetchCollaborations = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/collaboration-requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCollaborations(res.data);
      } catch {
        setError("Failed to load collaborations");
      } finally {
        setLoading(false);
      }
    };
    fetchCollaborations();
  }, []);

  const handleView = (collab: Collaboration) => {
    setSelectedCollab(collab);
    setDialogOpen(true);
  };

  const handleAccept = async (collab: Collaboration) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/collaboration-requests/${collab._id}`,
        { status: "accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCollaborations((prev) =>
        prev.map((c) =>
          c._id === collab._id ? { ...c, status: "accepted" } : c
        )
      );
    } catch {
      alert("Failed to accept collaboration.");
    }
    setDialogOpen(false);
  };

  const handleReject = async (collab: Collaboration) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/collaboration-requests/${collab._id}`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCollaborations((prev) =>
        prev.map((c) =>
          c._id === collab._id ? { ...c, status: "rejected" } : c
        )
      );
    } catch {
      alert("Failed to reject collaboration.");
    }
    setDialogOpen(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(collaborations.length / PAGE_SIZE);
  const paginatedCollaborations = collaborations.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Club Collaborations Requests
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage club collaborations.
        </p>
      </div>

      <DataTable
        columns={columns(handleView)}
        data={paginatedCollaborations}
        searchColumn="clubName"
        searchPlaceholder="Search collaborations..."
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

      <CollaborationDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        collaboration={selectedCollab}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
