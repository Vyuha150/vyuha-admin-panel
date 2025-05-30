"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UsersIcon,
  GraduationCapIcon,
  HandshakeIcon,
  FileIcon,
  ArrowRightIcon,
  Building2Icon,
  FileTextIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const [newClubApplications, setNewClubApplications] = useState<any[]>([]);
  const [clubCollaborations, setClubCollaborations] = useState<any[]>([]);
  const [centralTeamApplications, setCentralTeamApplications] = useState<any[]>(
    []
  );
  const [companies, setCompanies] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [coreTeamApplications, setCoreTeamApplications] = useState<any[]>([]);
  const [coreTeamRoles, setCoreTeamRoles] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/club-applications`,
        {
          headers,
        }
      ),
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/collaboration-requests`,
        {
          headers,
        }
      ),
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/club-partner/central-team-applications`,
        { headers }
      ),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`, {
        headers,
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        headers,
      }),
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/core-team-application`,
        { headers }
      ),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/core-team-role`, {
        headers,
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, { headers }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, { headers }),
    ])
      .then(
        ([
          newClubRes,
          clubCollabRes,
          centralTeamRes,
          companiesRes,
          enquiriesRes,
          coreTeamAppRes,
          coreTeamRolesRes,
          coursesRes,
          eventsRes,
        ]) => {
          setNewClubApplications(newClubRes.data);
          setClubCollaborations(clubCollabRes.data);
          setCentralTeamApplications(centralTeamRes.data);
          setCompanies(companiesRes.data);
          setEnquiries(enquiriesRes.data);
          setCoreTeamApplications(coreTeamAppRes.data);
          setCoreTeamRoles(coreTeamRolesRes.data);
          setCourses(coursesRes.data);
          setEvents(eventsRes.data);
        }
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: "New Clubs Applications",
      value: newClubApplications.length,
      icon: <GraduationCapIcon className="h-5 w-5" />,
      href: "/admin/newClubsApplications",
      description: "College clubs registered",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Club Collaborations Requests",
      value: clubCollaborations.length,
      icon: <HandshakeIcon className="h-5 w-5" />,
      href: "/admin/clubCollaborations",
      description: "Active collaborations",
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Central Team Applications",
      value: centralTeamApplications.length,
      icon: <UsersIcon className="h-5 w-5" />,
      href: "/admin/centralTeamApplications",
      description: "Registered members",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Companies",
      value: companies.length,
      icon: <Building2Icon className="h-5 w-5" />,
      href: "/admin/companies",
      description: "Partner companies",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Enquiries",
      value: enquiries.length,
      icon: <FileTextIcon className="h-5 w-5" />,
      href: "/admin/enquiries",
      description: "Job applications",
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      title: "Core Team Applications",
      value: coreTeamApplications.length,
      icon: <UserPlusIcon className="h-5 w-5" />,
      href: "/admin/coreTeamApplications",
      description: "Core team applications",
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "Core Team Roles",
      value: coreTeamRoles.length,
      icon: <UsersIcon className="h-5 w-5" />,
      href: "/admin/coreTeamRoles",
      description: "Core team roles",
      color: "bg-red-500/10 text-red-500",
    },
    {
      title: "Courses",
      value: courses.length,
      icon: <FileIcon className="h-5 w-5" />,
      href: "/admin/courses",
      description: "Courses offered",
      color: "bg-teal-500/10 text-teal-500",
    },
    {
      title: "Events",
      value: events.length,
      icon: <FileIcon className="h-5 w-5" />,
      href: "/admin/events",
      description: "Upcoming events",
      color: "bg-cyan-500/10 text-cyan-500",
    },
    {
      title: "Jobs",
      value: enquiries.length,
      icon: <FileTextIcon className="h-5 w-5" />,
      href: "/admin/jobs",
      description: "Jobs available",
      color: "bg-gray-500/10 text-gray-500",
    },
    {
      title: "Documents",
      value:
        newClubApplications.length +
        clubCollaborations.length +
        centralTeamApplications.length,
      icon: <FileIcon className="h-5 w-5" />,
      href: "#",
      description: "Total documents",
      color: "bg-indigo-500/10 text-indigo-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg text-muted-foreground">
          Loading dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin dashboard. View and manage your data from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.href !== "#" && (
                <Button
                  variant="ghost"
                  className="mt-4 p-0 h-auto font-normal text-sm"
                  asChild
                >
                  <Link href={stat.href}>
                    View all
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enquiries.slice(0, 3).map((application: any) => (
                <div
                  key={application.id || application._id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{application.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.subject}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/enquiries`}>Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Core Team Applications</CardTitle>
            <CardDescription>Latest core team applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coreTeamApplications.slice(0, 3).map((application: any) => (
                <div
                  key={application.id || application._id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{application.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof application.roleId === "string"
                        ? application.roleId
                            .split("-")
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : application.roleId && application.roleId.name // If it's an object with a name property
                        ? application.roleId.name
                        : ""}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/coreTeamApplications`}>Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
