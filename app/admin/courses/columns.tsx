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

export interface Course {
  _id: string;
  title: string;
  instructor: string;
  instructorPhoto: string;
  coursePhoto: string;
  description: string;
  details: string;
  prerequisites: string[];
  learningObjectives: string[];
  assessments: string;
  price: string;
  format: string;
  level: string;
  duration: string;
  rating: string;
  reviews: string;
  enrollLink: string;
  userReviews: string[];
}

export const columns = (
  handleEdit: (course: Course) => void,
  handleDelete: (course: Course) => void,
  handleViewDetails: (course: Course) => void
): ColumnDef<Course>[] => [
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
    cell: ({ row }: CellContext<Course, unknown>) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
    cell: ({ row }: CellContext<Course, unknown>) => (
      <span>{row.getValue("instructor")}</span>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }: CellContext<Course, unknown>) => (
      <span>{row.getValue("level")}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: CellContext<Course, unknown>) => (
      <span>{row.getValue("price")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }: CellContext<Course, unknown>) => {
      const course = row.original;
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
              onClick={() => handleViewDetails(course)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(course)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => handleDelete(course)}
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
