"use client";

import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface CoreTeamRole {
  _id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export const columns = (
  handleEdit: (role: CoreTeamRole) => void,
  handleDelete: (role: CoreTeamRole) => void,
  handleViewDetails: (role: CoreTeamRole) => void
): ColumnDef<CoreTeamRole>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: CellContext<CoreTeamRole, unknown>) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: CellContext<CoreTeamRole, unknown>) => (
      <span
        className="truncate max-w-xs block"
        title={row.getValue("description") as string}
      >
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "responsibilities",
    header: "Responsibilities",
    cell: ({ row }: CellContext<CoreTeamRole, unknown>) => {
      const responsibilities = row.getValue("responsibilities") as
        | string[]
        | undefined;
      return <div>{responsibilities ? responsibilities.length : 0}</div>;
    },
  },
  {
    accessorKey: "requirements",
    header: "Requirements",
    cell: ({ row }: CellContext<CoreTeamRole, unknown>) => {
      const requirements = row.getValue("requirements") as string[] | undefined;
      return <div>{requirements ? requirements.length : 0}</div>;
    },
  },
  {
    id: "actions2",
    cell: ({ row }: CellContext<CoreTeamRole, unknown>) => {
      const role = row.original;
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(role)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(role)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }: CellContext<CoreTeamRole, unknown>) => {
      const role = row.original;
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
              onClick={() => navigator.clipboard.writeText(role._id ?? "")}
              className="cursor-pointer"
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleViewDetails(role)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleEdit(role)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => handleDelete(role)}
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
