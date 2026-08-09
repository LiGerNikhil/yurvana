"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRfqCart } from "@/components/site/rfq-cart";
import { useToast } from "@/components/site/toast";

const rfqSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

type RfqFormValues = z.infer<typeof rfqSchema>;

export default function RfqPage() {
  const { lines, count, setQuantity, removeItem, clearAll } = useRfqCart();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RfqFormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      company: "",
      contactName: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      notes: "",
    },
  });

  const onSubmit = React.useCallback(
    async (values: RfqFormValues) => {
      if (lines.length === 0) {
        toast("Add items to your RFQ cart before submitting.");
        return;
      }

      try {
        const response = await fetch("/api/rfq", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            items: lines.map((line) => ({
              itemId: line.itemId,
              name: line.name,
              unit: line.unit,
              quantity: line.quantity,
            })),
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const message =
            errorBody?.error ||
            `Failed to submit RFQ (${response.status}). Please try again.`;
          throw new Error(message);
        }

        const data = await response.json();
        clearAll();
        router.push(`/rfq/success?id=${encodeURIComponent(data.rfqNumber)}`);
      } catch (error) {
        console.error("[rfq] submit failed:", error);
        toast(
          error instanceof Error
            ? error.message
            : "Unable to submit RFQ. Please try again.",
        );
      }
    },
    [lines, clearAll, router, toast],
  );

  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-border bg-surface p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Request a Quote
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Send your RFQ with buyer details.
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
              <span>
                {count} item{count === 1 ? "" : "s"} in RFQ cart
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={lines.length === 0}
              >
                Clear cart
              </Button>
            </div>
          </div>

          {lines.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-border bg-alt p-8 text-center">
              <p className="text-lg font-medium text-text-primary">
                Your RFQ cart is empty.
              </p>
              <p className="mt-2 text-sm text-text-muted">
                Add items from the catalog to start your quote request.
              </p>
              <Link href="/catalog">
                <Button type="button" className="mt-6">
                  Browse catalog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {lines.map((line) => (
                <div
                  key={line.itemId}
                  className="rounded-3xl border border-border bg-alt p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-text-primary">
                        {line.name}
                      </p>
                      <p className="text-sm text-text-muted">{line.unit}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setQuantity(
                            line.itemId,
                            Math.max(1, line.quantity - 1),
                          )
                        }
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(event) =>
                          setQuantity(
                            line.itemId,
                            Math.max(1, Number(event.target.value) || 1),
                          )
                        }
                        className={cn(
                          "h-9 w-20 rounded-lg border border-border bg-background px-3 text-center text-sm text-text-primary outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10",
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(line.itemId)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.85fr]">
          <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Buyer information
              </p>
              <p className="mt-3 text-sm text-text-muted">
                We will use this information to prepare your quote and follow up
                quickly.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-text-primary">
                    Company
                  </span>
                  <Input {...register("company")} />
                  {errors.company ? (
                    <p className="text-xs text-destructive">
                      {errors.company.message}
                    </p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-text-primary">
                    Contact name
                  </span>
                  <Input {...register("contactName")} />
                  {errors.contactName ? (
                    <p className="text-xs text-destructive">
                      {errors.contactName.message}
                    </p>
                  ) : null}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-text-primary">
                    Email
                  </span>
                  <Input {...register("email")} type="email" />
                  {errors.email ? (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-text-primary">
                    Phone
                  </span>
                  <Input {...register("phone")} />
                  {errors.phone ? (
                    <p className="text-xs text-destructive">
                      {errors.phone.message}
                    </p>
                  ) : null}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-text-primary">
                    City
                  </span>
                  <Input {...register("city")} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-text-primary">
                    Country
                  </span>
                  <Input {...register("country")} />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-text-primary">
                  Additional details
                </span>
                <textarea
                  {...register("notes")}
                  rows={5}
                  className={cn(
                    "w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10",
                  )}
                  placeholder="Tell us about quantities, target delivery, packing, or any other special requirements."
                />
                {errors.notes ? (
                  <p className="text-xs text-destructive">
                    {errors.notes.message}
                  </p>
                ) : null}
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-muted">
                  After submission, our sourcing team will follow up with a
                  quote and availability details.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting || lines.length === 0}
                >
                  {isSubmitting ? "Submitting RFQ…" : "Submit RFQ"}
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-alt p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary">
              RFQ summary
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Your quote request will be sent with the selected line items and
              buyer information.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-surface p-4">
                <span className="text-sm text-text-muted">Materials</span>
                <span className="text-sm font-semibold text-text-primary">
                  {lines.length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-surface p-4">
                <span className="text-sm text-text-muted">Total quantity</span>
                <span className="text-sm font-semibold text-text-primary">
                  {count}
                </span>
              </div>
              <div className="rounded-2xl bg-surface p-4 text-sm text-text-muted">
                Review the items and buyer details before you submit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
