"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, HeartHandshake, Users, Calendar, Building2, FileText, ArrowRight, Bot, Sparkles } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/chapters", label: "Chapters" },
  { href: "/directory", label: "Directory" },
  { href: "/#events", label: "Events" },
  { href: "/#contributions", label: "Welfare" },
  { href: "/noticeboard", label: "Noticeboard" },
  { href: "/#news", label: "News" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#leadership", label: "Leadership" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id], footer[id]");
      let current = "home";
      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= 140) current = s.id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      {/* Floating Modern Header (Agnos Style Island) */}
      <div className="sticky top-2 sm:top-4 z-50 px-3 sm:px-6 w-full max-w-6xl mx-auto">
        <header className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-[#E8E4DA] shadow-[0_4px_25px_rgba(0,0,0,0.05)] px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/#home" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="Mulembe18 Home">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-[#E8E4DA] flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform shadow-2xs">
                <img
                  src="/images/logo.png"
                  alt="Mulembe18 Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-black tracking-tight text-[#111827]" style={{ fontFamily: "var(--font-outfit)" }}>
                  mulembe
                </span>
                <span className="text-lg font-black text-[#FF5500]" style={{ fontFamily: "var(--font-outfit)" }}>
                  18
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-[#4B5563]" aria-label="Main Navigation">
              {navLinks.map(({ href, label }) => {
                const isAnchor = href.startsWith("/#");
                const targetId = isAnchor ? href.replace("/#", "") : "";
                const isActive = (pathname === "/" && isAnchor && activeSection === targetId) || (pathname === href);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-1.5 rounded-full transition-all duration-150 ${
                      isActive
                        ? "text-[#111827] font-bold bg-[#FAF9F6] border border-[#E8E4DA] shadow-2xs"
                        : "hover:text-[#111827] hover:bg-[#FAF9F6]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Msingi AI Assistant Trigger / Studio Link */}
              <Link
                href="/ai"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F6] hover:bg-[#F3F1EC] text-[#111827] border border-[#E8E4DA] text-xs font-bold transition-all shadow-2xs group"
                title="Fungua Msingi AI Studio"
              >
                <Sparkles size={13} className="text-[#FF5500] group-hover:rotate-12 transition-transform" />
                <span>Msingi AI</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FF5500] text-white font-mono font-bold tracking-wider">
                  KE
                </span>
              </Link>

              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="px-3.5 py-1.5 text-xs font-bold text-[#111827] border border-[#E8E4DA] rounded-full hover:bg-[#FAF9F6] transition-colors shadow-2xs"
                  >
                    Portal
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 border border-[#E8E4DA]",
                      },
                    }}
                  />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#4B5563] hover:text-[#111827] transition-colors whitespace-nowrap">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-[#111827] hover:bg-[#1F2937] text-white font-bold text-xs rounded-xl sm:rounded-full shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0">
                      Get started
                    </button>
                  </SignUpButton>
                </>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="xl:hidden p-2 rounded-xl text-[#374151] hover:bg-[#FAF9F6] transition-colors ml-1"
                aria-label={menuOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Drawer */}
          <div className={`xl:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[680px] pb-4" : "max-h-0"}`}>
            <nav className="border-t border-[#EAE7DF] pt-3 flex flex-col gap-1 bg-white mt-2" aria-label="Mobile Navigation">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={handleNavClick}
                  className="px-3.5 py-2 text-xs font-semibold text-[#374151] hover:text-[#111827] hover:bg-[#FAF9F6] rounded-xl transition-colors"
                >
                  {label}
                </Link>
              ))}

              {/* Mobile Msingi AI Button */}
              <div className="grid grid-cols-2 gap-2 mx-1 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new Event("open-msingi-ai"));
                    }
                  }}
                  className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA] text-[#111827] text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} className="text-[#FF5500]" />
                  <span>Ongea na AI</span>
                </button>
                <Link
                  href="/ai"
                  onClick={handleNavClick}
                  className="p-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>AI Studio</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#FF5500] text-white font-mono font-bold tracking-wider">
                    KE
                  </span>
                </Link>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#EAE7DF] mt-2">
                {isSignedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={handleNavClick}
                      className="flex-1 py-2 text-xs font-bold text-center text-[#111827] border border-[#E8E4DA] rounded-xl hover:bg-[#FAF9F6] transition-colors"
                    >
                      Member Portal
                    </Link>
                    <UserButton />
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button
                        onClick={handleNavClick}
                        className="flex-1 py-2 text-xs font-semibold text-center text-[#4B5563] border border-[#E8E4DA] rounded-xl hover:border-[#111827] transition-colors"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button
                        onClick={handleNavClick}
                        className="flex-1 py-2 text-xs font-bold text-center text-white bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-colors shadow-xs"
                      >
                        Get started
                      </button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
