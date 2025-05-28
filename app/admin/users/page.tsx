"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, User } from "./columns";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { UserFormDialog } from "./UserFormDialog";

const PAGE_SIZE = 10;

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Map userName to name for each user
        const usersWithName = res.data.map((u: any) => ({
          ...u,
          name: u.name || u.username || "",
        }));
        setUsers(usersWithName);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load users. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (user: User) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete user. Please try again."
      );
    }
  };

  const handleAddUser = async (user: Partial<User>) => {
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) => [res.data, ...prev]);
      setFormOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to add user. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async (user: Partial<User>) => {
    if (!editUser) return;
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${editUser._id}`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === editUser._id ? res.data.user : u))
      );
      setEditUser(null);
      setFormOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update user. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditUser(null);
    setFormOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const handleView = (user: User) => {
    setViewUser(user);
    setDetailsOpen(true);
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button onClick={openAddDialog}>Add User</Button>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search by name, email, phone, or role..."
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
      <UserDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        user={viewUser}
      />
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={editUser ? handleEditUser : handleAddUser}
        loading={formLoading}
        initialData={editUser}
        isEdit={!!editUser}
      />
    </div>
  );
}
