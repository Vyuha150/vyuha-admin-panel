"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyModal, Company } from "./CompanyModel";
import { CompanyDetailsDialog } from "./CompanyDetailsDialog";

const PAGE_SIZE = 10;

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompanies(res.data);
      } catch {
        setError("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Edit company
  const handleEdit = (company: Company) => {
    setEditCompany(company);
    setModalOpen(true);
  };

  // Delete company
  const handleDelete = async (company: Company) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${company._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies((prev) => prev.filter((c) => c._id !== company._id));
    } catch {
      alert("Failed to delete company.");
    }
  };

  // Add company
  const handleAdd = () => {
    setEditCompany(null);
    setModalOpen(true);
  };

  // Save (add or edit)
  const handleSave = async (fields: Partial<Company> | FormData) => {
    const token = Cookies.get("token");
    try {
      if (editCompany) {
        // Edit
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${editCompany._id}`,
          fields,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              ...(fields instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : {}),
            },
          }
        );
        // refetch or update state as needed
      } else {
        // Add
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies`,
          fields,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              ...(fields instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : {}),
            },
          }
        );
        // refetch or update state as needed
      }
    } catch {
      alert("Failed to save company.");
    }
  };

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setDetailsOpen(true);
  };

  const handleContact = (company: Company) => {
    if (company.contact) {
      window.open(`mailto:${company.contact}`);
    }
  };

  // Filter companies by search
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);
  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <Button onClick={handleAdd}>Add Company</Button>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
      </div>
      <DataTable
        columns={columns(
          handleEdit,
          handleDelete,
          handleViewDetails,
          handleContact
        )}
        data={paginatedCompanies}
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
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
      <CompanyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        initialData={editCompany}
      />
      <CompanyDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        company={selectedCompany}
      />
    </div>
  );
}
