"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "./columns";
import Image from "next/image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

export function CourseDetailsDialog({ open, onOpenChange, course }: Props) {
  if (!course) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl"
        style={{ height: "80vh", maxHeight: "80vh", overflow: "hidden" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{course.title}</span>
            <Badge variant="secondary">Course</Badge>
          </DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>
        <div
          className="space-y-4 py-2 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          <div className="flex gap-6 items-center">
            {course.coursePhoto && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${course.coursePhoto}`}
                alt="Course"
                width={120}
                height={80}
                className="rounded object-cover border"
              />
            )}
            <div>
              <div>
                <span className="text-sm text-muted-foreground">Level:</span>
                <span className="ml-2 font-medium">{course.level}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Format:</span>
                <span className="ml-2 font-medium">{course.format}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="ml-2 font-medium">{course.duration}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Price:</span>
                <span className="ml-2 font-medium">{course.price}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Rating:</span>
                <span className="ml-2 font-medium">{course.rating}</span>
                <span className="ml-2 text-muted-foreground">
                  ({course.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Details:</span>
            <div className="ml-2 font-medium">{course.details}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Prerequisites:
            </span>
            <ul className="ml-6 list-disc">
              {course.prerequisites.map((item, idx) => (
                <li key={idx} className="font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              Learning Objectives:
            </span>
            <ul className="ml-6 list-disc">
              {course.learningObjectives.map((item, idx) => (
                <li key={idx} className="font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Assessments:</span>
            <span className="ml-2 font-medium">{course.assessments}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Enroll Link:</span>
            <a
              href={course.enrollLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 underline"
            >
              {course.enrollLink}
            </a>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">User Reviews:</span>
            <ul className="ml-6 list-disc">
              {course.userReviews.map((review, idx) => (
                <li key={idx} className="font-medium">
                  {review}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
