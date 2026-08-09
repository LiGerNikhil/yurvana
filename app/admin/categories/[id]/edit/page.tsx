"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id;
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    register,
    handleSubmit,
    reset,
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

  React.useEffect(() => {
    if (!categoryId) return;

    const loadCategory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load category.");
        }

        reset({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          sortOrder: Number(data.sortOrder) || 0,
          isActive: Boolean(data.isActive),
        });
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : String(fetchError),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadCategory();
  }, [categoryId, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    if (!categoryId) return;
    setError(null);
    setSuccess(null);

    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "PATCH",
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
      setError(data?.error || "Unable to update category.");
      return;
    }

    setSuccess("Category updated successfully.");
  };

  if (!categoryId) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        Missing category ID.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Edit category
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">
              Update category details
            </h1>
            <p className="mt-2 text-sm leading-7 text-text-muted">
              Modify the category name, slug, description or visibility.
            </p>
          </div>
          <Badge variant="outline">Category ID: {categoryId}</Badge>
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 rounded-3xl border border-border bg-surface p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <Input
              type="text"
              {...register("name")}
              className="mt-2"
              disabled={isLoading}
            />
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
            <Input
              type="text"
              {...register("slug")}
              className="mt-2"
              disabled={isLoading}
            />
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
          <Input
            type="text"
            {...register("description")}
            className="mt-2"
            disabled={isLoading}
          />
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
              disabled={isLoading}
            />
          </div>
          <div className="flex items-end gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border border-input text-primary focus:ring-ring"
                disabled={isLoading}
              />
              Active
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? "Saving changes…" : "Save category"}
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
