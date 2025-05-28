"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PodcastPartner {
  _id: string;
  name: string;
  number: string;
  partnerType: string;
  comments: string;
  document?: string;
  createdAt?: string;
}

export const columns = (
  handleView: (partner: PodcastPartner) => void,
  handleDelete: (partner: PodcastPartner) => void
): ColumnDef<PodcastPartner>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "number",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("number")}</div>,
  },
  {
    accessorKey: "partnerType",
    header: "Partner Type",
    cell: ({ row }) => <div>{row.getValue("partnerType")}</div>,
  },
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => {
      const doc = row.original.document;
      return doc ? (
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto"
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/${doc.replace(/^\//, "")}`,
              "_blank"
            )
          }
        >
          <Download className="mr-1 h-4 w-4" />
          Download
        </Button>
      ) : (
        <span className="text-muted-foreground text-xs">No Document</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const partner = row.original;
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
              onClick={() => navigator.clipboard.writeText(partner._id)}
              className="cursor-pointer"
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleView(partner)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={() => handleDelete(partner)}
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
