"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface AuthCheckProps {
  children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const auth = Cookies.get("isAuthenticated") === "true";
      setIsAuthenticated(auth);

      if (!auth && !pathname.includes("/admin/login")) {
        router.push("/admin/login");
      } else if (auth && pathname === "/admin/login") {
        router.push("/admin/dashboard");
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  return isAuthenticated ? <>{children}</> : null;
}
