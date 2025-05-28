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

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  organizerBio?: string;
  organizerPhoto?: string;
  platformLink?: string;
  fees?: string;
  materials?: string;
  isRecorded?: boolean;
  image?: string;
  category: string;
  mode: string;
  targetAudience?: string;
  logo?: string;
}

export const columns = (
  handleEdit: (event: Event) => void,
  handleDelete: (event: Event) => void,
  handleViewDetails: (event: Event) => void
): ColumnDef<Event>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: CellContext<Event, unknown>) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }: CellContext<Event, unknown>) => (
      <span>{row.getValue("date")}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }: CellContext<Event, unknown>) => (
      <span>{row.getValue("location")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }: CellContext<Event, unknown>) => (
      <span>{row.getValue("category")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }: CellContext<Event, unknown>) => {
      const event = row.original;
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
              onClick={() => handleViewDetails(event)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(event)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => handleDelete(event)}
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
