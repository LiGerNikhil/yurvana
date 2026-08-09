"use client";

import * as React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const callbackUrl = "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = React.useCallback(
    async (values: LoginFormValues) => {
      setError(null);
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!result) {
        setError("Unable to sign in. Please try again.");
        return;
      }

      if (result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(result.url || callbackUrl);
    },
    [callbackUrl, router],
  );

  return (
    <main className="min-h-screen bg-bg-base px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-surface p-8 shadow-sm sm:p-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
            Admin access
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Sign in to your dashboard
          </h1>
          <p className="text-sm leading-7 text-text-muted">
            Enter your admin credentials to manage catalog pricing and RFQ
            leads.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="mt-2"
            />
            {errors.email ? (
              <p className="mt-2 text-sm text-destructive">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="mt-2"
            />
            {errors.password ? (
              <p className="mt-2 text-sm text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 rounded-3xl bg-bg-alt p-5 text-sm text-text-muted">
          <p>
            Admin accounts are managed outside the public site. Contact your
            operations lead if you need access.
          </p>
          <p className="mt-3 text-xs text-text-muted/80">
            Note: uses secure credentials and JWT session strategy.
          </p>
        </div>
      </div>
    </main>
  );
}
