"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/site/toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please share your inquiry details"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = React.useCallback(
    async (values: ContactFormValues) => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(
            errorBody?.error ||
              "Unable to send your message. Please try again.",
          );
        }

        reset();
        toast("Your inquiry has been sent. We will reply shortly.");
      } catch (error) {
        console.error("[contact] submit failed:", error);
        toast(
          error instanceof Error
            ? error.message
            : "Unable to send your message.",
        );
      }
    },
    [reset, toast],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <section className="rounded-3xl border border-border bg-surface p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Get in touch with our sourcing team.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-text-muted">
          Send us your inquiry and we will connect you with the right raw
          material specialist for herbs, oils, seeds and extracts.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-text-primary">
                Name
              </span>
              <Input {...register("name")} />
              {errors.name ? (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              ) : null}
            </label>
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
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-text-primary">Phone</span>
            <Input {...register("phone")} />
            {errors.phone ? (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-text-primary">
              Message
            </span>
            <textarea
              {...register("message")}
              rows={6}
              className={cn(
                "w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10",
              )}
              placeholder="Tell us what you need help with — product details, order size, quality requirements or shipping questions."
            />
            {errors.message ? (
              <p className="text-xs text-destructive">
                {errors.message.message}
              </p>
            ) : null}
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-muted">
              We typically respond to inquiries within one business day.
            </p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send inquiry"}
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-6 rounded-3xl border border-border bg-alt p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Contact details
          </p>
          <p className="mt-4 text-sm leading-7 text-text-muted">
            Reach our team for sourcing support, product questions and bulk
            order coordination.
          </p>
        </div>
        <div className="space-y-4 text-sm text-text-muted">
          <div className="rounded-3xl border border-border bg-white p-5">
            <p className="font-semibold text-text-primary">Powered by</p>
            <p className="mt-2">YURVANA AGRO SOLUTIONS PVT. LTD.</p>
            <p>123 Botanical Avenue</p>
            <p>Mumbai, Maharashtra, India</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-5">
            <p className="font-semibold text-text-primary">Phone</p>
            <p className="mt-2">+91 22 1234 5678</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-5">
            <p className="font-semibold text-text-primary">Email</p>
            <p className="mt-2">quotes@yurvanaagro.com</p>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-5">
          <p className="font-semibold text-text-primary">Location</p>
          <div className="mt-4 h-44 rounded-3xl bg-border" aria-hidden="true">
            <div className="flex h-full items-center justify-center text-sm text-text-muted">
              Map placeholder
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
