import { useState } from "react";
import { GlassCard } from "react-glass-ui";
import { Link, NavLink } from "react-router-dom";
import logoDark from "../assets/Logo Dark.png";
import logoLight from "../assets/Wildbook_light.svg";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Explore Experts", to: "/experts" },
  { label: "Shared Safaris", to: "/safaris" },
  { label: "Discover Packages", to: "/packages" },
] as const;

export type NavbarVariant = "light" | "dark";

interface NavbarProps {
  variant?: NavbarVariant;
}

export default function Navbar({ variant = "light" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = variant === "light";

  const linkClasses = (active: boolean) =>
    `block px-5 py-2.5 text-sm font-medium transition-colors ${
      active
        ? "bg-(--color-wildbook-teal) text-(--color-wildbook-cream)"
        : isLight
          ? "text-(--color-wildbook-cream) hover:bg-white/10"
          : "text-black hover:bg-black/10"
    }`;

  return (
    <nav className="">
      <GlassCard
        className="w-full!"
        borderRadius={0}
        blur={10}
        brightness={isLight ? 100 : 110}
        borderColor="transparent"
      >
        <div className="flex w-full items-center justify-between gap-4 px-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center" aria-label="Wildbook home">
            <img
              src={isLight ? logoDark : logoLight}
              alt="Wildbook"
              className="h-4 w-auto min-[1000px]:h-6"
            />
          </Link>

          {/* Navigation links - desktop at 1000px+ */}
          <ul className="hidden items-center justify-center gap-1 min-[1000px]:flex min-[1000px]:gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `rounded px-5 py-2 text-sm font-medium transition-colors min-[1000px]:px-6 min-[1000px]:py-2 ${
                      isActive
                        ? "bg-(--color-wildbook-teal) text-(--color-wildbook-cream)"
                        : isLight
                          ? "text-(--color-wildbook-cream) hover:bg-white/10"
                          : "text-black hover:bg-black/10"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Login - visible at 1000px+ */}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `hidden shrink-0 rounded px-6 py-2 text-sm font-medium min-[1000px]:inline-flex min-[1000px]:items-center min-[1000px]:gap-2 ${
                isActive
                  ? "bg-(--color-wildbook-teal) text-(--color-wildbook-cream)"
                  : isLight
                    ? "text-(--color-wildbook-cream) hover:bg-white/10"
                    : "text-black hover:bg-black/10"
              }`
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
            </svg>
            Login
          </NavLink>

          {/* Hamburger button - below 1000px */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex min-[1000px]:hidden shrink-0 flex-col justify-center gap-1.5 rounded p-2 -mr-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`h-0.5 w-5 rounded-full transition-transform ${
                isLight ? "bg-white" : "bg-black"
              } ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-opacity ${
                isLight ? "bg-white" : "bg-black"
              } ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-transform ${
                isLight ? "bg-white" : "bg-black"
              } ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>

        {/* Mobile menu - below 1000px */}
        <div
          className={`min-[1000px]:hidden overflow-hidden transition-[max-height,opacity] duration-200 ${
            mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 border-t border-black/10 py-4 px-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => linkClasses(isActive)}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `mt-2 rounded px-6 py-2.5 text-center text-sm font-medium ${
                  isActive
                    ? "bg-(--color-wildbook-teal) text-(--color-wildbook-cream)"
                    : isLight
                      ? "text-(--color-wildbook-cream) hover:bg-white/10"
                      : "text-black hover:bg-black/10"
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </NavLink>
          </div>
        </div>
      </GlassCard>
    </nav>
  );
}
