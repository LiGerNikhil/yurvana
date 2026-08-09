"use client";

import * as React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  quoted: "bg-slate-100 text-slate-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-destructive/10 text-destructive",
  closed: "bg-muted text-muted-foreground",
};

type RfqRow = {
  _id: string;
  rfqNumber: number;
  company: string;
  contactName: string;
  email: string;
  status: string;
  items: Array<{ quantity: number }>;
  createdAt: string;
};

export default function AdminRfqsPage() {
  const [rfqs, setRfqs] = React.useState<RfqRow[]>([]);
  const [statusFilter, setStatusFilter] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRfqs = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const response = await fetch(`/api/admin/rfqs?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to load RFQs.");
      }

      setRfqs(data.rfqs || []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : String(fetchError),
      );
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

  React.useEffect(() => {
    void fetchRfqs();
  }, [fetchRfqs]);

  const countByStatus = rfqs.reduce(
    (acc, rfq) => {
      acc[rfq.status] = (acc[rfq.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Request for quote
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">
              Manage RFQ leads
            </h1>
            <p className="mt-2 text-sm leading-7 text-text-muted">
              Review RFQs from buyers, filter by status, and update lead
              progress.
            </p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["new", "quoted", "approved", "rejected", "closed"].map((status) => (
          <div
            key={status}
            className="rounded-3xl border border-border bg-surface p-6 shadow-sm"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
              {status}
            </p>
            <p className="mt-4 text-3xl font-semibold text-text-primary">
              {countByStatus[status] || 0}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              RFQ list
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {rfqs.length} request(s) found.
            </p>
          </div>
          <Button variant="ghost" onClick={() => void fetchRfqs()}>
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_220px]">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by company, contact, email"
              className="mt-2 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="quoted">Quoted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-text-muted"
                  >
                    Loading RFQs...
                  </TableCell>
                </TableRow>
              ) : rfqs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-text-muted"
                  >
                    No RFQs found.
                  </TableCell>
                </TableRow>
              ) : (
                rfqs.map((rfq) => (
                  <TableRow key={rfq._id}>
                    <TableCell>#{rfq.rfqNumber}</TableCell>
                    <TableCell>{rfq.company}</TableCell>
                    <TableCell>{rfq.contactName}</TableCell>
                    <TableCell>{rfq.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusStyles[rfq.status] ||
                          "bg-muted text-muted-foreground"
                        }
                      >
                        {rfq.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{rfq.items.length}</TableCell>
                    <TableCell>
                      {new Date(rfq.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/rfqs/${rfq._id}`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
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
