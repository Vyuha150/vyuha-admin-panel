"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Organization {
  _id: string;
  registerAs: "individual" | "organization";
  name: string;
  logo?: string;
  organizationType?: string;
  activeMembers?: string;
  pastEvents?: string;
  collegeUniversity?: string;
  contactEmail: string;
  contactPhone: string;
  createdAt?: string;
}

export const columns = (
  handleView: (org: Organization) => void,
  handleDelete: (org: Organization) => void,
  handleEdit: (org: Organization) => void
): ColumnDef<Organization>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "registerAs",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("registerAs")}</span>
    ),
  },
  {
    accessorKey: "organizationType",
    header: "Org Type",
    cell: ({ row }) => <div>{row.getValue("organizationType") || "-"}</div>,
  },
  {
    accessorKey: "contactEmail",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("contactEmail")}</div>,
  },
  {
    accessorKey: "contactPhone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("contactPhone")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const org = row.original;
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
              onClick={() => navigator.clipboard.writeText(org._id)}
              className="cursor-pointer"
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleView(org)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleEdit(org)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={() => handleDelete(org)}
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
