"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { Menu, X, Sun, Moon } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Chapters", href: "/chapters" },
    { label: "Events", href: "/events" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="glass-navbar sticky-top py-2 px-3 px-md-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Brand */}
        <Link
          href="/"
          className="text-decoration-none fw-bold fs-5 text-white d-flex align-items-center gap-2"
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              background: "linear-gradient(135deg, #f5e6b3 0%, #d4af37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mulembe Nation
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="d-none d-lg-flex align-items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-decoration-none small transition-colors ${
                pathname === link.href ? "text-warning fw-semibold" : "text-white-50 hover-text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="d-flex align-items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            className="btn btn-sm btn-glass text-white px-2 py-1"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth State */}
          {isSignedIn ? (
            <div className="d-flex align-items-center gap-2">
              <Link href="/profile" className="btn btn-sm btn-glass px-3 d-none d-sm-inline">
                My Profile
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "border border-warning shadow-sm",
                  },
                }}
              />
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <SignInButton mode="modal">
                <button className="btn btn-sm btn-glass text-white px-3">
                  Sign In
                </button>
              </SignInButton>
              <Link href="/sign-up" className="btn btn-sm btn-gold px-3 d-none d-sm-inline">
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="btn btn-sm btn-glass text-white d-lg-none px-2 py-1 ms-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Drawer */}
      {isOpen && (
        <div className="d-lg-none mt-3 pt-3 border-top border-white-10">
          <div className="d-flex flex-column gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-decoration-none px-2 py-1 rounded small ${
                  pathname === link.href ? "text-warning fw-bold bg-white-5" : "text-white-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isSignedIn && (
              <Link
                href="/sign-up"
                className="btn btn-gold w-100 text-center mt-2"
                onClick={() => setIsOpen(false)}
              >
                Join Community
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

