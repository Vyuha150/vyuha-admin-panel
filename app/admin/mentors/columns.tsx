"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export const columns = (
  handleView: (mentor: Mentor) => void,
  handleDelete: (mentor: Mentor) => void,
  handleEdit: (mentor: Mentor) => void
): ColumnDef<Mentor>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => <div>{row.getValue("industry")}</div>,
  },
  {
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {(row.original.skills || []).map((skill: string) => (
          <span
            key={skill}
            className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => <div>{row.getValue("experience")}</div>,
  },
  {
    accessorKey: "mentorshipStyle",
    header: "Style",
    cell: ({ row }) => <div>{row.getValue("mentorshipStyle")}</div>,
  },
  {
    accessorKey: "availability",
    header: "Availability",
    cell: ({ row }) => <div>{row.getValue("availability")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const mentor = row.original;
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
              onClick={() => navigator.clipboard.writeText(mentor._id)}
              className="cursor-pointer"
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleView(mentor)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleEdit(mentor)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={() => handleDelete(mentor)}
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
