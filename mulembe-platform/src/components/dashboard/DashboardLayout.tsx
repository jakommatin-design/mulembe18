"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Users,
  Building,
  Calendar,
  Bell,
  ShieldCheck,
  BarChart3,
  Menu,
  X,
  MapPin,
} from "lucide-react";

interface Props {
  role: string;
  countyCode?: string | null;
  chapterId?: string | null;
  children: React.ReactNode;
}

export default function DashboardLayout({
  role,
  countyCode,
  children,
}: Props) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isNational = role === "national_admin" || role === "super_admin";
  const isCounty = role === "county_coordinator" || isNational;

  const navItems = [
    {
      label: "Overview & Analytics",
      href: isNational
        ? "/dashboard/national"
        : isCounty
          ? "/dashboard/county"
          : "/dashboard/chapter",
      icon: <BarChart3 size={18} />,
    },
    {
      label: "Member Roster & Approvals",
      href: isNational
        ? "/dashboard/national#roster"
        : isCounty
          ? "/dashboard/county#roster"
          : "/dashboard/chapter#roster",
      icon: <Users size={18} />,
    },
    {
      label: "Chapter Assemblies",
      href: isNational ? "/dashboard/national#chapters" : "/dashboard/chapter#events",
      icon: <Building size={18} />,
    },
    {
      label: "Events & Calendar",
      href: isNational ? "/dashboard/national#events" : "/dashboard/chapter#events",
      icon: <Calendar size={18} />,
    },
    {
      label: "Notices & Dispatches",
      href: isNational ? "/dashboard/national#notices" : "/dashboard/chapter#notices",
      icon: <Bell size={18} />,
    },
  ];

  if (isNational) {
    navItems.push({
      label: "Audit Logs & Governance",
      href: "/dashboard/national#audit",
      icon: <ShieldCheck size={18} />,
    });
  }

  const roleLabel = role.replace(/_/g, " ").toUpperCase();

  return (
    <div className="min-vh-100 d-flex flex-column bg-transparent">
      {/* Top Navbar */}
      <header className="glass-navbar border-bottom border-white-10 py-3 px-4 position-sticky top-0 z-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-sm btn-glass d-lg-none text-light p-1"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="text-decoration-none d-flex align-items-center gap-2">
              <span
                className="fw-bold fs-5"
                style={{
                  fontFamily: "var(--font-serif)",
                  background: "linear-gradient(135deg, #f5e6b3 0%, #d4af37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Mulembe
              </span>
              <span className="badge rounded-pill bg-warning text-dark small fw-bold px-2 py-1">
                {roleLabel}
              </span>
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link href="/profile" className="btn btn-sm btn-glass text-light d-none d-md-inline">
              My Member Card
            </Link>
            <Link href="/" className="btn btn-sm btn-glass text-light d-none d-md-inline">
              Public Portal
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="d-flex flex-grow-1">
        {/* Desktop Sidebar */}
        <aside
          className="glass-sidebar d-none d-lg-flex flex-column justify-content-between p-4"
          style={{ width: 280, minHeight: "calc(100vh - 70px)" }}
        >
          <div>
            <div className="p-3 rounded glass-card mb-4">
              <span className="small text-secondary d-block">Administrative Scope</span>
              <strong className="text-light d-flex align-items-center gap-1 mt-1">
                <MapPin size={14} className="text-warning" />
                {isNational
                  ? "National (47 Counties)"
                  : countyCode
                    ? `County ${countyCode}`
                    : "Chapter Scope"}
              </strong>
            </div>

            <nav className="d-flex flex-column gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`btn text-start d-flex align-items-center gap-3 px-3 py-2 rounded ${
                    pathname === item.href ? "btn-gold text-dark" : "btn-glass text-light"
                  }`}
                >
                  {item.icon}
                  <span className="small fw-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-3 border-top border-secondary border-opacity-25 small text-secondary">
            Mulembe Governance v1.0
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-grow-1 p-4 p-md-5 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

