"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, Project } from "./columns";
import { ProjectDetailsDialog } from "./ProjectDetailsDialog";
import { ProjectFormDialog } from "./ProjectFormDialog";

const PAGE_SIZE = 10;

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load projects. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (project: Project) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${project._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete project. Please try again."
      );
    }
  };

  const handleAddProject = async (
    project: Partial<Project>,
    file?: File | null
  ) => {
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      Object.entries(project).forEach(([key, value]) => {
        if (
          key === "skills" ||
          key === "goals" ||
          key === "deliverables" ||
          key === "evaluationCriteria"
        ) {
          formData.append(key, value as string);
        } else if (value !== undefined) {
          formData.append(key, value as string);
        }
      });
      if (file) formData.append("image", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProjects((prev) => [res.data, ...prev]);
      setFormOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to add project. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProject = async (
    project: Partial<Project>,
    file?: File | null
  ) => {
    if (!editProject) return;
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      Object.entries(project).forEach(([key, value]) => {
        if (
          key === "skills" ||
          key === "goals" ||
          key === "deliverables" ||
          key === "evaluationCriteria"
        ) {
          formData.append(key, value as string);
        } else if (value !== undefined) {
          formData.append(key, value as string);
        }
      });
      if (file) formData.append("image", file);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${editProject._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProjects((prev) =>
        prev.map((p) => (p._id === editProject._id ? res.data : p))
      );
      setEditProject(null);
      setFormOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update project. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditProject(null);
    setFormOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditProject(project);
    setFormOpen(true);
  };

  const handleView = (project: Project) => {
    setViewProject(project);
    setDetailsOpen(true);
  };

  const filtered = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      (p.skills || []).join(", ").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Button onClick={openAddDialog}>Add Project</Button>
      </div>
      <div className="max-w-xs mb-2">
        <Input
          placeholder="Search by title, description, or skills..."
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
      <ProjectDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        project={viewProject}
      />
      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={editProject ? handleEditProject : handleAddProject}
        loading={formLoading}
        initialData={editProject}
        isEdit={!!editProject}
      />
    </div>
  );
}
