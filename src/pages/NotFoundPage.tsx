import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export function NotFoundPage() {
  return (
    <>
      <header className="mx-auto max-w-[1920px]">
        <Navbar variant="dark" />
      </header>
      <main className="mx-auto max-w-[1920px] page-px py-16">
        <h1 className="text-3xl font-semibold text-(--color-wildbook-text)">
          Page not found
        </h1>
        <p className="mt-3 text-(--color-wildbook-muted)">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded border border-[#3B372F] px-6 py-2 text-sm font-medium text-(--color-wildbook-text) hover:bg-black/5"
        >
          Back to Home
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </main>
    </>
  );
}

