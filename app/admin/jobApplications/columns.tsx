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

export interface JobApplication {
  _id: string;
  name: string;
  email: string;
  jobId: string;
  coverLetter?: string;
  resume?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt?: string;
}

export const columns = (
  handleView: (app: JobApplication) => void,
  handleDelete: (app: JobApplication) => void
): ColumnDef<JobApplication>[] => [
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
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "jobId",
    header: "Job ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("jobId")}</div>
    ),
  },
  {
    accessorKey: "resume",
    header: "Resume",
    cell: ({ row }) => {
      const resume = row.getValue("resume") as string | undefined;
      return resume ? (
        <div className="flex items-center gap-2">
          <FileIcon className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto"
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_API_URL}/${resume.replace(
                  /^\//,
                  ""
                )}`,
                "_blank"
              )
            }
          >
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">No Resume</span>
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
      const app = row.original;
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
              onClick={() => navigator.clipboard.writeText(app._id)}
              className="cursor-pointer"
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleView(app)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={() => handleDelete(app)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
