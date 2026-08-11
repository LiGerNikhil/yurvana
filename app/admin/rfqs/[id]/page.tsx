"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RfqItem = {
  name: string;
  unit: string;
  quantity: number;
  targetPrice: number | null;
};

type RfqData = {
  _id: string;
  rfqNumber: number;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  notes: string;
  status: string;
  items: RfqItem[];
  createdAt: string;
  updatedAt: string;
};

const statusOptions = ["new", "quoted", "approved", "rejected", "closed"];
const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  quoted: "bg-slate-100 text-slate-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-destructive/10 text-destructive",
  closed: "bg-muted text-muted-foreground",
};

export default function AdminRfqDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rfqId = params?.id;

  const [rfq, setRfq] = React.useState<RfqData | null>(null);
  const [status, setStatus] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!rfqId) return;

    const loadRfq = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/rfqs/${rfqId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load RFQ.");
        }
        setRfq(data);
        setStatus(data.status);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : String(fetchError),
        );
      } finally {
        setLoading(false);
      }
    };

    void loadRfq();
  }, [rfqId]);

  const handleUpdateStatus = async () => {
    if (!rfqId) return;
    if (!status) {
      setError("Select a status before saving.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/admin/rfqs/${rfqId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to update status.");
      }
      setRfq(data);
      setSuccess("Status updated successfully.");
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : String(fetchError),
      );
    } finally {
      setSaving(false);
    }
  };

  if (!rfqId) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        Missing RFQ ID.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              RFQ detail
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">
              Quote request details
            </h1>
            <p className="mt-2 text-sm leading-7 text-text-muted">
              Review request data, buyer contact details, and update the request
              status.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin/rfqs")}>
            Back to RFQs
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm text-sm text-text-muted">
          Loading RFQ...
        </div>
      ) : rfq ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
                  RFQ #{rfq.rfqNumber}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                  {rfq.company}
                </h2>
              </div>
              <Badge
                className={
                  statusStyles[rfq.status] || "bg-muted text-muted-foreground"
                }
              >
                {rfq.status}
              </Badge>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                  Contact
                </p>
                <p className="mt-2 text-sm text-text-primary">
                  {rfq.contactName}
                </p>
                <p className="text-sm text-text-muted">{rfq.email}</p>
                {rfq.phone ? (
                  <p className="text-sm text-text-muted">{rfq.phone}</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                  Location
                </p>
                <p className="mt-2 text-sm text-text-primary">
                  {rfq.city || "-"}, {rfq.country || "-"}
                </p>
                <p className="text-xs text-text-muted">
                  Submitted {new Date(rfq.createdAt).toLocaleString()}
                </p>
                <p className="text-xs text-text-muted">
                  Updated {new Date(rfq.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {rfq.notes ? (
              <div className="mt-8 rounded-3xl border border-border bg-muted/50 p-4 text-sm text-text-muted">
                <p className="font-semibold text-text-primary">Notes</p>
                <p className="mt-2">{rfq.notes}</p>
              </div>
            ) : null}

            <div className="mt-8">
              <h3 className="text-base font-semibold text-text-primary">
                Requested items
              </h3>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Target price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfq.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          {item.targetPrice != null
                            ? `₹${item.targetPrice.toLocaleString("en-IN")}`
                            : "TBD"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Update status
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-2 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleUpdateStatus} disabled={saving}>
                {saving ? "Saving…" : "Save status"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm text-sm text-text-muted">
          RFQ not found.
        </div>
      )}
    </div>
  );
}
