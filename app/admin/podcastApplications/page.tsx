"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, PodcastPartner } from "./columns";
import { PodcastPartnerDetailsDialog } from "./PodcastDetailsDialog";

const PAGE_SIZE = 10;

export default function PodcastPartnersAdminPage() {
  const [partners, setPartners] = useState<PodcastPartner[]>([]);
  const [viewPartner, setViewPartner] = useState<PodcastPartner | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/podcast-partner`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPartners(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load podcast partners. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const handleDelete = async (partner: PodcastPartner) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/podcast-partner/${partner._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPartners((prev) => prev.filter((p) => p._id !== partner._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete podcast partner. Please try again."
      );
    }
  };

  const handleView = (partner: PodcastPartner) => {
    setViewPartner(partner);
    setDetailsOpen(true);
  };

  const filtered = partners.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.number?.toLowerCase().includes(search.toLowerCase()) ||
      p.partnerType?.toLowerCase().includes(search.toLowerCase()) ||
      p.comments?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Podcast Partner Forms
        </h1>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search by name, phone, partner type, or comments..."
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
      <PodcastPartnerDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        partner={viewPartner}
      />
    </div>
  );
}
