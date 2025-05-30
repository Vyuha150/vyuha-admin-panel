"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Calendar, Mail, Phone, MessageCircle, User } from "lucide-react";

interface Booking {
  _id: string;
  mentorId: string;
  userId?: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  message?: string;
  createdAt?: string;
}

export interface Mentor {
  _id: string;
  name: string;
  photo?: string;
  skills: string[];
  industry: string;
  experience: string;
  mentorshipStyle: string;
  availability: string;
}

export default function MentorBookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorMap, setMentorMap] = useState<Record<string, Mentor>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [bookingsRes, mentorsRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/mentors/admin/bookings/all`,
            { headers }
          ),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/mentors`, {
            headers,
          }),
        ]);
        setBookings(bookingsRes.data);
        setMentors(mentorsRes.data);
        // Create a map for quick lookup
        const map: Record<string, Mentor> = {};
        mentorsRes.data.forEach((mentor: Mentor) => {
          map[mentor._id] = mentor;
        });
        setMentorMap(map);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load bookings or mentors. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = bookings.filter(
    (b) =>
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.toLowerCase().includes(search.toLowerCase()) ||
      b.date?.toLowerCase().includes(search.toLowerCase()) ||
      b.time?.toLowerCase().includes(search.toLowerCase()) ||
      mentorMap[b.mentorId]?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {row.original.email}
        </div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {row.original.phone || "-"}
        </div>
      ),
    },
    {
      header: "Mentor",
      accessorKey: "mentorId",
      cell: ({ row }: any) => {
        const mentor = mentorMap[row.original.mentorId];
        return mentor ? (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{mentor.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              ({mentor._id})
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Unknown</span>
        );
      },
    },
    {
      header: "Date & Time",
      accessorKey: "date",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date(row.original.date).toLocaleDateString()} at{" "}
          {row.original.time}
        </div>
      ),
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: ({ row }: any) =>
        row.original.message ? (
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="truncate max-w-[180px]">
              {row.original.message}
            </span>
          </div>
        ) : (
          "-"
        ),
    },
    {
      header: "Booked On",
      accessorKey: "createdAt",
      cell: ({ row }: any) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleString()
          : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mentor Bookings</h1>
        <Input
          placeholder="Search by email, phone, date, or mentor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </div>
  );
}
