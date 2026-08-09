"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoryCreatePage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setError(null);

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        slug: values.slug,
        description: values.description || "",
        sortOrder: Number(values.sortOrder) || 0,
        isActive: Boolean(values.isActive),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data?.error || "Unable to create category.");
      return;
    }

    router.push("/admin/categories");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Create category
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">
              Add a new category
            </h1>
            <p className="mt-2 text-sm leading-7 text-text-muted">
              Create a new catalog category and choose whether it should be
              visible in the storefront.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 rounded-3xl border border-border bg-surface p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <Input type="text" {...register("name")} className="mt-2" />
            {errors.name ? (
              <p className="mt-2 text-sm text-destructive">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Slug
            </label>
            <Input type="text" {...register("slug")} className="mt-2" />
            {errors.slug ? (
              <p className="mt-2 text-sm text-destructive">
                {errors.slug.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary">
            Description
          </label>
          <Input type="text" {...register("description")} className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Sort order
            </label>
            <Input
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              className="mt-2"
            />
          </div>
          <div className="flex items-end gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border border-input text-primary focus:ring-ring"
                defaultChecked
              />
              Active
            </label>
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating category…" : "Create category"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/admin/categories")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
