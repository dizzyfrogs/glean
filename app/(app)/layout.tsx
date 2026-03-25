"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sprout, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";

const ROLE_LABELS: Record<string, string> = {
  staff: "Kitchen Staff",
  manager: "Manager",
  foodbank: "Food Bank",
};

const MANAGER_NAV = [
  { href: "/manager", label: "Dashboard" },
  { href: "/manager/logs", label: "Waste Logs" },
  { href: "/manager/surplus", label: "Surplus" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentRole = useStore((s) => s.currentRole);
  const currentUser = useStore((s) => s.currentUser);
  const clearRole = useStore((s) => s.clearRole);

  useEffect(() => {
    if (!currentRole) router.replace("/");
  }, [currentRole, router]);

  if (!currentRole || !currentUser) return null;

  function signOut() {
    clearRole();
    router.push("/");
  }

  const roleBadgeVariant =
    currentRole === "staff" ? "logged" : currentRole === "manager" ? "available" : "pending";

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f3f0]">
      <nav className="bg-white border-b border-[#e7e5e0] sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
          <Link
            href={currentRole === "foodbank" ? "/foodbank" : `/${currentRole}`}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-7 h-7 rounded-full bg-[#4a7c2f] flex items-center justify-center">
              <Sprout size={14} strokeWidth={1.5} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-fraunces text-[15px] font-[500] text-[#1a1916]">Glean</span>
          </Link>

          {currentRole === "manager" && (
            <div className="flex items-center gap-1 ml-2">
              {MANAGER_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors ${
                    pathname === link.href
                      ? "bg-[#f2f7ee] text-[#4a7c2f]"
                      : "text-[#5c5851] hover:bg-[#f4f3f0] hover:text-[#1a1916]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span className="text-[13px] font-semibold text-[#1a1916] hidden sm:block">
              {currentUser.name}
            </span>
            <Badge variant={roleBadgeVariant}>{ROLE_LABELS[currentRole]}</Badge>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-[13px] text-[#7d7870] hover:text-[#1a1916] transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={14} strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
}
