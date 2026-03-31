import Navbar, { type NavbarVariant } from "../components/Navbar";

export function PageScaffold({
  title,
  variant = "dark",
}: {
  title: string;
  variant?: NavbarVariant;
}) {
  return (
    <>
      <header className="mx-auto max-w-[1920px]">
        <Navbar variant={variant} />
      </header>
      <main className="mx-auto max-w-[1920px] page-px py-12">
        <h1 className="text-3xl font-semibold text-(--color-wildbook-text)">
          {title}
        </h1>
        <p className="mt-3 max-w-[820px] text-(--color-wildbook-muted)">
          This page is wired up with React Router. Replace this scaffold with the
          real content when you’re ready.
        </p>
      </main>
    </>
  );
}

