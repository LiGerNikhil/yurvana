"use client";

import * as React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminItem = {
  _id: string;
  name: string;
  slug: string;
  categoryName: string;
  priceLow: number | null;
  priceHigh: number | null;
  isActive: boolean;
  isFeatured: boolean;
  updatedAt: string;
};

type AdminCategory = {
  _id: string;
  name: string;
};

const statusBadge = (value: boolean) =>
  value ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700";

const priceLabel = (value: number | null) =>
  value == null ? "—" : `${value.toLocaleString()} USD`;

export default function AdminItemsPage() {
  const [items, setItems] = React.useState<AdminItem[]>([]);
  const [categories, setCategories] = React.useState<AdminCategory[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [percent, setPercent] = React.useState(5);
  const [isLoading, setIsLoading] = React.useState(true);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (categoryFilter) params.set("category", categoryFilter);

      const response = await fetch(`/api/admin/items?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load items.");
      }

      setItems(data.items || []);
      setCategories(data.categories || []);
      setSelectedIds([]);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : String(fetchError),
      );
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryFilter]);

  React.useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleToggle = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(items.map((item) => item._id));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item permanently?")) {
      return;
    }
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/admin/items/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data?.error || "Unable to delete item.");
      return;
    }

    setMessage("Item deleted successfully.");
    void fetchItems();
  };

  const handleBulkUpdate = async () => {
    if (!selectedIds.length) {
      setError("Select at least one item to apply the price update.");
      return;
    }
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/admin/items/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, percent }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data?.error || "Unable to update item prices.");
      return;
    }

    setMessage(`Updated ${data.items.length} item(s) by ${percent}%`);
    void fetchItems();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Item management
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-text-primary">
            Products & pricing
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-text-muted">
            Create and update products, track price changes, and manage
            inventory activity for the catalog.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/items/new">
            <Button>Create item</Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline">Manage categories</Button>
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Catalog filters
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Search by name, SKU or category, and apply your view.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("");
                }}
              >
                Reset
              </Button>
              <Button variant="ghost" onClick={() => void fetchItems()}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text-primary">
                Search
              </label>
              <Input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search items, slug, category"
                className="mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="mt-2 h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-text-primary">
            Bulk price update
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Select items from the table and apply a percentage change.
          </p>

          <div className="mt-5 space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-text-primary">
                Percentage
              </label>
              <Input
                type="number"
                value={percent}
                onChange={(event) => setPercent(Number(event.target.value))}
                className="mt-2"
              />
            </div>
            <div className="grid gap-2">
              <p className="text-sm text-text-muted">
                Selected{" "}
                <span className="font-semibold">{selectedIds.length}</span>{" "}
                item(s)
              </p>
              <Button onClick={handleBulkUpdate} disabled={!selectedIds.length}>
                Apply price update
              </Button>
            </div>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Item list
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {items.length} item(s) available.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSelectAll}>
              {selectedIds.length === items.length
                ? "Unselect all"
                : "Select all"}
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      items.length > 0 && selectedIds.length === items.length
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border border-input text-primary focus:ring-ring"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price low / high</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-text-muted"
                  >
                    Loading items...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-text-muted"
                  >
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={() => handleToggle(item._id)}
                        className="h-4 w-4 rounded border border-input text-primary focus:ring-ring"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-text-primary">
                        {item.name}
                      </div>
                      <p className="text-xs text-text-muted">{item.slug}</p>
                    </TableCell>
                    <TableCell>{item.categoryName || "Unassigned"}</TableCell>
                    <TableCell>
                      <div>{priceLabel(item.priceLow)}</div>
                      <div className="text-xs text-text-muted">
                        {priceLabel(item.priceHigh)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${statusBadge(item.isFeatured)}`}
                      >
                        {item.isFeatured ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${statusBadge(item.isActive)}`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/items/${item._id}/edit`}>
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => void handleDelete(item._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
