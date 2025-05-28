"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, Membership } from "./columns";
import { MembershipDetailsDialog } from "./MembershipDetailsDialog";

const PAGE_SIZE = 10;

export default function MembershipsAdminPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [viewMembership, setViewMembership] = useState<Membership | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberships = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/membership`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMemberships(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load memberships. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMemberships();
  }, []);

  const handleDelete = async (membership: Membership) => {
    if (!window.confirm("Are you sure you want to delete this membership?"))
      return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/membership/${membership._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMemberships((prev) => prev.filter((m) => m._id !== membership._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete membership. Please try again."
      );
    }
  };

  const handleView = (membership: Membership) => {
    setViewMembership(membership);
    setDetailsOpen(true);
  };

  const filtered = memberships.filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.organization.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Membership Applications
        </h1>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search by name, email, or organization..."
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
      <MembershipDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        membership={viewMembership}
      />
    </div>
  );
}
