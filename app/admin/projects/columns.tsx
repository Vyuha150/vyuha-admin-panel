"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Pencil,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Project {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  difficulty: string;
  teamSize: string;
  skills: string[];
  goals: string[];
  deliverables: string[];
  evaluationCriteria: string[];
  image?: string;
  createdAt?: string;
}

export const columns = (
  handleView: (project: Project) => void,
  handleDelete: (project: Project) => void,
  handleEdit: (project: Project) => void
): ColumnDef<Project>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) =>
      row.original.deadline
        ? new Date(row.original.deadline).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => <div>{row.getValue("difficulty")}</div>,
  },
  {
    accessorKey: "teamSize",
    header: "Team Size",
    cell: ({ row }) => <div>{row.getValue("teamSize")}</div>,
  },
  {
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => (
      <div className="truncate max-w-[120px]">
        {(row.original.skills || []).join(", ")}
      </div>
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) =>
      row.original.image ? (
        <a
          href={`${
            process.env.NEXT_PUBLIC_API_URL
          }/${row.original.image.replace(/^\//, "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ImageIcon className="h-5 w-5 text-blue-600" />
        </a>
      ) : (
        <span className="text-muted-foreground text-xs">No Image</span>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project._id)}
              className="cursor-pointer"
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleView(project)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleEdit(project)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={() => handleDelete(project)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
