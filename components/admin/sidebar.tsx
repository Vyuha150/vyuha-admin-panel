"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  Handshake,
  GraduationCap,
  LogOut,
  Menu,
  User,
  Building2,
  FileText,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { title } from "process";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/admin/login");
  };

  const NavItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Central Team Applications",
      href: "/admin/centralTeamApplications",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Club Collaborations",
      href: "/admin/clubCollaborations",
      icon: <Handshake className="h-5 w-5" />,
    },
    {
      title: "Companies",
      href: "/admin/companies",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      title: "Core Team Applications",
      href: "/admin/coreTeamApplications",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      title: "Core Team Roles",
      href: "/admin/coreTeamRoles",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Courses",
      href: "/admin/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },

    {
      title: "Enquiries",
      href: "/admin/enquiries",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Events",
      href: "/admin/events",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: "Job Applications",
      href: "/admin/jobApplications",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Jobs",
      href: "/admin/jobs",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Join Requests",
      href: "/admin/joinRequests",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "MemberShip Applications",
      href: "/admin/memberships",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Mentors",
      href: "/admin/mentors",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "New Club Applications",
      href: "/admin/newClubsApplications",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: "Podcast Applications",
      href: "/admin/podcastApplications",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden bg-gray-400 fixed top-4 right-4 z-50"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {isOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
          )}
        >
          <div className="flex h-14 items-center px-4 border-b border-border">
            <div className="flex items-center font-semibold text-lg">
              <User className="mr-2 h-5 w-5" />
              <span>Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          {/* Scrollable nav links */}
          <ScrollArea className="flex-1">
            <div className="px-3 py-2">
              <nav className="grid gap-1 px-2">
                {NavItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        pathname === item.href ? "bg-secondary" : ""
                      )}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
          {/* Fixed logout button at bottom */}
          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "relative h-screen border-r border-border flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        "transition-width duration-300 ease-in-out",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-3">
        <div
          className={cn(
            "flex items-center font-semibold text-lg overflow-hidden",
            isCollapsed ? "opacity-0 invisible" : "opacity-100 visible",
            "transition-all duration-300"
          )}
        >
          <User className="mr-2 h-5 w-5 flex-shrink-0" />
          <span className="whitespace-nowrap">Admin Panel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-9 w-9", isCollapsed ? "mx-auto" : "ml-auto")}
          onClick={toggleSidebar}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
      {/* Scrollable nav links */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <nav className="grid gap-1 px-2">
            {NavItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                    pathname === item.href ? "bg-secondary" : ""
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span className="ml-2">{item.title}</span>}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
      {/* Fixed logout button at bottom */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            isCollapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
