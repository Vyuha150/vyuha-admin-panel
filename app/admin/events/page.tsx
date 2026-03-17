"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { columns as baseColumns, Event } from "./columns";
import { EventModal } from "./EventModal";
import { EventDetailsDialog } from "./EventDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [viewEvent, setViewEvent] = useState<Event | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events?summary=true`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 12000,
          }
        );
        setEvents(res.data);
      } catch (err: any) {
        if (err?.code === "ECONNABORTED") {
          setError(
            "Request timed out while loading events. Please check backend server and refresh."
          );
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Failed to load events. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Add or Edit event (with file upload)
  const handleSave = async (
    event: Partial<Event>,
    imageFile?: File | null,
    logoFile?: File | null
  ) => {
    const token = Cookies.get("token");
    try {
      const formData = new FormData();
      Object.entries(event).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (editEvent) {
        // Edit
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${editEvent._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEvents((prev) =>
          prev.map((e) => (e._id === editEvent._id ? res.data : e))
        );
      } else {
        // Add
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEvents((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
      setEditEvent(null);
    } catch (err: any) {
      const validationErrors = err?.response?.data?.errors;
      const validationMessage = Array.isArray(validationErrors)
        ? validationErrors.map((e: any) => e?.msg).filter(Boolean).join(", ")
        : "";

      setError(
        validationMessage ||
        err?.response?.data?.message ||
          "Failed to save event. Please try again."
      );
    }
  };

  // Delete event
  const handleDelete = async (event: Event) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents((prev) => prev.filter((e) => e._id !== event._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete event. Please try again."
      );
    }
  };

  // View details
  const handleView = async (event: Event) => {
    const token = Cookies.get("token");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 12000,
        }
      );
      setViewEvent(res.data);
    } catch {
      setViewEvent(event);
    }
    setDetailsOpen(true);
  };

  // Edit
  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setModalOpen(true);
  };

  const columns = baseColumns(handleEdit, handleDelete, handleView);

  // Filter events by search (case-insensitive)
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <Button
          onClick={() => {
            setEditEvent(null);
            setModalOpen(true);
          }}
        >
          Add Event
        </Button>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <DataTable columns={columns} data={paginatedEvents} />
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
        </>
      )}
      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        initialData={editEvent}
      />
      <EventDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        event={viewEvent}
      />
    </div>
  );
}
