"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { CentralTeamMemberDialog, Member } from "./CentralTeamMemberDialog";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const PAGE_SIZE = 10;

export default function MembersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch members from backend
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/central-team-applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMembers(res.data);
      } catch (err: any) {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  // Optionally, call backend to update status
  const handleAccept = async (member: Member) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/central-team-applications/${member._id}`,
        { status: "accepted" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers((prev) =>
        prev.map((m) =>
          m._id === member._id ? { ...m, status: "accepted" } : m
        )
      );
    } catch {
      alert("Failed to accept application.");
    }
    setDialogOpen(false);
  };

  const handleReject = async (member: Member) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/central-team-applications/${member._id}`,
        { status: "rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers((prev) =>
        prev.map((m) =>
          m._id === member._id ? { ...m, status: "rejected" } : m
        )
      );
    } catch {
      alert("Failed to reject application.");
    }
    setDialogOpen(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(members.length / PAGE_SIZE);
  const paginatedMembers = members.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Central Team Applications
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage registered members.
        </p>
      </div>

      <DataTable
        columns={columns(handleView)}
        data={paginatedMembers}
        searchColumn="name"
        searchPlaceholder="Search members..."
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

      <CentralTeamMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={selectedMember}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
