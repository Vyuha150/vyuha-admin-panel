"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, Organization } from "./columns";
import { JoinRequestsDetailsDialog } from "./JoinRequestsDetailsDialog";
import { JoinRequestsFormDialog } from "./JoinRequestsFromDialog";

const PAGE_SIZE = 10;

export default function OrganizationsAdminPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [viewOrg, setViewOrg] = useState<Organization | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<Organization | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organization`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrganizations(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load organizations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizations();
  }, []);

  const handleDelete = async (org: Organization) => {
    if (!window.confirm("Are you sure you want to delete this organization?"))
      return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organization/${org._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrganizations((prev) => prev.filter((o) => o._id !== org._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete organization. Please try again."
      );
    }
  };

  const handleAddOrg = async (
    org: Partial<Organization>,
    file?: File | null
  ) => {
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      Object.entries(org).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value as string);
      });
      if (file) formData.append("logo", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organization/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOrganizations((prev) => [res.data, ...prev]);
      setFormOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to add organization. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditOrg = async (
    org: Partial<Organization>,
    file?: File | null
  ) => {
    if (!editOrg) return;
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      Object.entries(org).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value as string);
      });
      if (file) formData.append("logo", file);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organization/${editOrg._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOrganizations((prev) =>
        prev.map((o) => (o._id === editOrg._id ? res.data : o))
      );
      setEditOrg(null);
      setFormOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update organization. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditOrg(null);
    setFormOpen(true);
  };

  const openEditDialog = (org: Organization) => {
    setEditOrg(org);
    setFormOpen(true);
  };

  const handleView = (org: Organization) => {
    setViewOrg(org);
    setDetailsOpen(true);
  };

  const filtered = organizations.filter(
    (o) =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.contactEmail?.toLowerCase().includes(search.toLowerCase()) ||
      o.organizationType?.toLowerCase().includes(search.toLowerCase()) ||
      o.collegeUniversity?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Organizations & Individuals
        </h1>
        <Button onClick={openAddDialog}>Add</Button>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search by name, email, org type, or college..."
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
      <JoinRequestsDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        organization={viewOrg}
      />
      <JoinRequestsFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={editOrg ? handleEditOrg : handleAddOrg}
        loading={formLoading}
        initialData={editOrg}
        isEdit={!!editOrg}
      />
    </div>
  );
}
