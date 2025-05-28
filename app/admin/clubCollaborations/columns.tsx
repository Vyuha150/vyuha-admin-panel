"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  FileIcon,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Collaboration {
  _id: string;
  clubName: string;
  collegeName: string;
  phone: string;
  collaborationDetails: string;
  document: string;
  status: "pending" | "accepted" | "rejected";
}

export const columns = (
  handleView: (collab: Collaboration) => void
): ColumnDef<Collaboration>[] => [
  {
    accessorKey: "clubName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Club Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("clubName")}</div>
    ),
  },
  {
    accessorKey: "collegeName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          College
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("collegeName")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("phone")}</div>
    ),
  },
  {
    accessorKey: "collaborationDetails",
    header: "Collaboration Details",
    cell: ({ row }) => (
      <div
        className="max-w-[300px] truncate"
        title={row.getValue("collaborationDetails")}
      >
        {row.getValue("collaborationDetails")}
      </div>
    ),
  },
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => {
      const document = row.getValue("document") as string;
      return (
        <div className="flex items-center gap-2">
          <FileIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{document}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let colorClass = "bg-gray-200 text-gray-800";
      if (status === "accepted") colorClass = "bg-green-100 text-green-800";
      else if (status === "rejected") colorClass = "bg-red-100 text-red-800";
      else if (status === "pending")
        colorClass = "bg-yellow-100 text-yellow-800";

      return (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}
        >
          {status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Pending"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const collaboration = row.original;

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
              onClick={() => navigator.clipboard.writeText(collaboration._id)}
              className="cursor-pointer"
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleView(collaboration)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={!collaboration.document}
              onClick={() => {
                if (collaboration.document) {
                  window.open(
                    `${process.env.NEXT_PUBLIC_API_URL}/${collaboration.document}`,
                    "_blank"
                  );
                }
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
