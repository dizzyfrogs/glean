"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  LayoutDashboard,
  Heart,
  ChevronRight,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

interface RoleOption {
  id: Role;
  icon: React.ReactNode;
  title: string;
  description: string;
  route: string;
}

const ROLES: RoleOption[] = [
  {
    id: "staff",
    icon: <ChefHat size={20} strokeWidth={1.5} aria-hidden="true" />,
    title: "Kitchen Staff",
    description: "Log waste and track daily entries",
    route: "/staff",
  },
  {
    id: "manager",
    icon: <LayoutDashboard size={20} strokeWidth={1.5} aria-hidden="true" />,
    title: "Kitchen Manager",
    description: "Dashboard, analytics, and surplus management",
    route: "/manager",
  },
  {
    id: "foodbank",
    icon: <Heart size={20} strokeWidth={1.5} aria-hidden="true" />,
    title: "Food Bank",
    description: "Browse and claim surplus food offerings",
    route: "/foodbank",
  },
];


export default function LoginPage() {
  const router = useRouter();
  const setRole = useStore((s) => s.setRole);
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setRole(selected);
    const route = ROLES.find((r) => r.id === selected)!.route;
    router.push(route);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* left panel */}
      <div
        className="relative lg:w-[52%] flex flex-col p-8 lg:p-12 overflow-hidden"
        style={{
          backgroundColor: "#2d5016",
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(74,124,47,0.35) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#4a7c2f] flex items-center justify-center">
              <Sprout size={16} strokeWidth={1.5} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-fraunces text-[13px] font-[500] text-[#9fc87d] tracking-widest">
              Glean
            </span>
          </div>
        </div>

        {/* hero */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12 lg:py-0">
          <h1
            className="font-fraunces text-[56px] lg:text-[72px] font-[600] leading-[0.95] tracking-tight"
            style={{ color: "#f0ead6" }}
          >
            Less waste.
            <br />
            <span style={{ color: "#9fc87d" }}>More good.</span>
          </h1>
          <p className="mt-5 text-[16px] text-[#a8b89a] max-w-[320px] leading-relaxed font-jakarta">
            Connecting campus dining halls to the communities that need it most.
          </p>
        </div>
      </div>

      {/* role selector */}
      <div className="lg:w-[48%] flex items-center justify-center bg-white p-8 lg:p-12">
        <div className="w-full max-w-[400px]">
          {/* heading */}
          <div className="mb-8">
            <h2
              className="font-fraunces text-[28px] font-[500] text-[#1a1916] mb-1.5"
            >
              Welcome back
            </h2>
            <p className="text-[14px] text-[#7d7870] font-jakarta">
              Sign in as your role to continue
            </p>
          </div>

          {/* Role cards */}
          <div className="flex flex-col gap-3 mb-8" role="radiogroup" aria-label="Select your role">
            {ROLES.map((role) => {
              const isSelected = selected === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelected(role.id)}
                  className={`group relative flex items-center gap-4 p-4 rounded-[14px] text-left transition-all duration-150 cursor-pointer outline-none
                    focus-visible:ring-2 focus-visible:ring-[#4a7c2f] focus-visible:ring-offset-2
                    ${isSelected
                      ? "border-2 border-[#4a7c2f] bg-[#f2f7ee] shadow-[0_0_0_0px_rgba(74,124,47,0.15)]"
                      : "border border-[#e7e5e0] bg-white hover:border-[#4a7c2f] hover:shadow-[inset_3px_0_0_#4a7c2f,0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-[1px]"
                    }`}
                  style={{ minHeight: "72px" }}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors duration-150
                      ${isSelected ? "bg-[#4a7c2f] text-white" : "bg-[#f4f3f0] text-[#5c5851] group-hover:bg-[#e1efd6] group-hover:text-[#3d6827]"}`}
                  >
                    {role.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-fraunces text-[16px] font-[500] leading-tight mb-0.5 ${isSelected ? "text-[#2d5016]" : "text-[#1a1916]"}`}
                    >
                      {role.title}
                    </p>
                    <p className={`text-[13px] leading-snug font-jakarta ${isSelected ? "text-[#3d6827]" : "text-[#7d7870]"}`}>
                      {role.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    className={`flex-shrink-0 transition-all duration-150 ${isSelected ? "text-[#4a7c2f] translate-x-0.5" : "text-[#d4d1ca] group-hover:text-[#4a7c2f]"}`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <Button
            onClick={handleContinue}
            disabled={!selected}
            loading={loading}
            size="lg"
            className="w-full"
          >
            {selected
              ? `Continue as ${ROLES.find((r) => r.id === selected)?.title}`
              : "Select a role to continue"}
          </Button>

          <p className="mt-5 text-center text-[12px] text-[#7d7870] font-jakarta">
            Demo mode
          </p>
        </div>
      </div>
    </div>
  );
}
