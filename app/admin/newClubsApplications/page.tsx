"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { columns, Club } from "./columns";
import { ClubDetailsDialog } from "./ClubDetailsDialog";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function NewClubsApplicationsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/club-applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClubs(res.data);
      } catch {
        setError("Failed to load club applications");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const totalPages = Math.ceil(clubs.length / PAGE_SIZE);
  const paginatedClubs = clubs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleView = (club: Club) => {
    setSelectedClub(club);
    setDialogOpen(true);
  };

  const handleAccept = async (club: Club) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/club-applications/${club._id}`,
        { status: "accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClubs((prev) =>
        prev.map((c) => (c._id === club._id ? { ...c, status: "accepted" } : c))
      );
    } catch {
      alert("Failed to accept application.");
    }
    setDialogOpen(false);
  };

  const handleReject = async (club: Club) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/club-applications/${club._id}`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClubs((prev) =>
        prev.map((c) => (c._id === club._id ? { ...c, status: "rejected" } : c))
      );
    } catch {
      alert("Failed to reject application.");
    }
    setDialogOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          New Club Applications
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage registered college clubs.
        </p>
      </div>

      <DataTable
        columns={columns(handleView)}
        data={paginatedClubs}
        searchColumn="clubName"
        searchPlaceholder="Search clubs..."
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

      <ClubDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        club={selectedClub}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
