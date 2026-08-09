"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().optional(),
  form: z.string().optional(),
  unit: z.string().optional(),
  priceLow: z.number().nullable(),
  priceHigh: z.number().nullable(),
  qualityNote: z.string().optional(),
  referenceUrl: z.string().optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

type AdminCategory = { _id: string; name: string };

export default function AdminItemCreatePage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      form: "",
      unit: "kg",
      priceLow: null,
      priceHigh: null,
      qualityNote: "",
      referenceUrl: "",
      image: "",
      isFeatured: false,
      isActive: true,
    },
  });

  const watchedName = watch("name");
  const watchedSlug = watch("slug");

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories", {
          cache: "no-store",
        });
        const data = await response.json();
        if (response.ok) {
          setCategories(data || []);
        }
      } catch {
        setCategories([]);
      }
    };
    void loadCategories();
  }, []);

  React.useEffect(() => {
    if (watchedName && !watchedSlug) {
      const normalized = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      reset({ ...watch(), slug: normalized });
    }
  }, [watchedName, watchedSlug, reset, watch]);

  const onSubmit = async (values: ItemFormValues) => {
    setError(null);
    setIsLoading(true);

    const selectedCategory = categories.find(
      (category) => category._id === values.category,
    );
    const body = {
      name: values.name,
      slug: values.slug,
      category: values.category || null,
      categoryName: selectedCategory?.name || "",
      form: values.form || "",
      unit: values.unit || "kg",
      priceLow: Number.isFinite(values.priceLow as number)
        ? values.priceLow
        : null,
      priceHigh: Number.isFinite(values.priceHigh as number)
        ? values.priceHigh
        : null,
      qualityNote: values.qualityNote || "",
      referenceUrl: values.referenceUrl || "",
      image: values.image || "",
      isFeatured: Boolean(values.isFeatured),
      isActive: Boolean(values.isActive),
    };

    const response = await fetch("/api/admin/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data?.error || "Unable to create item.");
      setIsLoading(false);
      return;
    }

    router.push("/admin/items");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Create item
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">
              Add new product
            </h1>
            <p className="mt-2 text-sm leading-7 text-text-muted">
              Create a new catalog item and set initial pricing, category, and
              visibility.
            </p>
          </div>
          <div>
            <Badge variant="outline">
              Categories loaded: {categories.length}
            </Badge>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Category
            </label>
            <select
              className="mt-2 h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              {...register("category")}
            >
              <option value="">Unassigned</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Unit
            </label>
            <Input type="text" {...register("unit")} className="mt-2" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Price low
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("priceLow", { valueAsNumber: true })}
              className="mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Price high
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("priceHigh", { valueAsNumber: true })}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Reference URL
            </label>
            <Input type="url" {...register("referenceUrl")} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Image URL
            </label>
            <Input type="url" {...register("image")} className="mt-2" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Quality note
            </label>
            <Input type="text" {...register("qualityNote")} className="mt-2" />
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-text-primary">
              Visibility
            </label>
            <div className="flex flex-wrap gap-3 pt-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="h-4 w-4 rounded border border-input text-primary focus:ring-ring"
                />
                Featured
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  defaultChecked
                  {...register("isActive")}
                  className="h-4 w-4 rounded border border-input text-primary focus:ring-ring"
                />
                Active
              </label>
            </div>
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? "Creating item…" : "Create item"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/admin/items")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
