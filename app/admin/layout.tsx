import Link from "next/link";

import { SignOutButton } from "@/components/admin/SignOutButton";

export const metadata = {
  title: "Admin | YURVANA AGRO",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[280px_1fr]">
        <aside className="space-y-6 rounded-[2rem] border border-border bg-surface p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              Admin panel
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              YURVANA AGRO
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Manage products, categories, quotes, and pricing from one place.
            </p>
          </div>

          <nav className="space-y-2 pt-4">
            <Link
              href="/admin/dashboard"
              className="block rounded-2xl border border-border bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/20"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/items"
              className="block rounded-2xl border border-border bg-transparent px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface"
            >
              Items
            </Link>
            <Link
              href="/admin/categories"
              className="block rounded-2xl border border-border bg-transparent px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface"
            >
              Categories
            </Link>
            <Link
              href="/admin/rfqs"
              className="block rounded-2xl border border-border bg-transparent px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface"
            >
              RFQs
            </Link>
          </nav>

          <div className="border-t border-border pt-4">
            <SignOutButton />
          </div>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
