"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { columns as baseColumns, CoreTeamRole } from "./columns";
import { RoleModal } from "./RoleModal";
import { CoreTeamRoleDetailsDialog } from "./RoleDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

export default function CoreTeamRolesPage() {
  const [roles, setRoles] = useState<CoreTeamRole[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editRole, setEditRole] = useState<CoreTeamRole | null>(null);
  const [viewRole, setViewRole] = useState<CoreTeamRole | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-role`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRoles(res.data);
      } catch {
        setError("Failed to load roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Add or Edit role
  const handleSave = async (role: Partial<CoreTeamRole>) => {
    const token = Cookies.get("token");
    try {
      if (editRole) {
        // Edit
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-role/${editRole._id}`,
          role,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRoles((prev) =>
          prev.map((r) => (r._id === editRole._id ? res.data : r))
        );
      } else {
        // Add
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-role`,
          role,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRoles((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
      setEditRole(null);
    } catch {
      alert("Failed to save role.");
    }
  };

  // Delete role
  const handleDelete = async (role: CoreTeamRole) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-role/${role._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoles((prev) => prev.filter((r) => r._id !== role._id));
    } catch {
      alert("Failed to delete role.");
    }
  };

  // View details
  const handleView = (role: CoreTeamRole) => {
    setViewRole(role);
    setDetailsOpen(true);
  };

  // Edit
  const handleEdit = (role: CoreTeamRole) => {
    setEditRole(role);
    setModalOpen(true);
  };

  const columns = baseColumns(handleEdit, handleDelete, handleView);

  // Filter roles by search (case-insensitive)
  const filteredRoles = roles.filter((role) =>
    role.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRoles.length / PAGE_SIZE);
  const paginatedRoles = filteredRoles.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Core Team Roles</h1>
        <Button
          onClick={() => {
            setEditRole(null);
            setModalOpen(true);
          }}
        >
          Add Role
        </Button>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search roles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
      </div>
      <DataTable columns={columns} data={paginatedRoles} />
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
      <RoleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        initialData={editRole}
      />
      <CoreTeamRoleDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        role={viewRole}
      />
    </div>
  );
}
