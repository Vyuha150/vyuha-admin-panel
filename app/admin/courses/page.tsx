"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { columns as baseColumns, Course } from "./columns";
import { CourseModal } from "./CourseModal";
import { CourseDetailsDialog } from "./CourseDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses(res.data);
      } catch {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Add or Edit course (with file upload)
  const handleSave = async (course: Partial<Course>, file?: File | null) => {
    const token = Cookies.get("token");
    try {
      const formData = new FormData();
      Object.entries(course).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // For array fields, send as JSON string
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
      if (file) {
        formData.append("coursePhoto", file);
      }

      if (editCourse) {
        // Edit
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${editCourse._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setCourses((prev) =>
          prev.map((c) => (c._id === editCourse._id ? res.data : c))
        );
      } else {
        // Add
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setCourses((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
      setEditCourse(null);
    } catch {
      alert("Failed to save course.");
    }
  };

  // Delete course
  const handleDelete = async (course: Course) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
    } catch {
      alert("Failed to delete course.");
    }
  };

  // View details
  const handleView = (course: Course) => {
    setViewCourse(course);
    setDetailsOpen(true);
  };

  // Edit
  const handleEdit = (course: Course) => {
    setEditCourse(course);
    setModalOpen(true);
  };

  const columns = baseColumns(handleEdit, handleDelete, handleView);

  // Filter courses by search (case-insensitive)
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);
  const paginatedCourses = filteredCourses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <Button
          onClick={() => {
            setEditCourse(null);
            setModalOpen(true);
          }}
        >
          Add Course
        </Button>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
      </div>
      <DataTable columns={columns} data={paginatedCourses} />
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
      <CourseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        initialData={editCourse}
      />
      <CourseDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        course={viewCourse}
      />
    </div>
  );
}
