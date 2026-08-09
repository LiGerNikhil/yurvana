"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().default(""),
  form: z.string().default(""),
  unit: z.string().default("kg"),
  priceLow: z.number().nullable().default(null),
  priceHigh: z.number().nullable().default(null),
  qualityNote: z.string().default(""),
  referenceUrl: z.string().default(""),
  image: z.string().default(""),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type ItemFormValues = z.input<typeof itemSchema>;

type AdminCategory = { _id: string; name: string };

type AdminItem = {
  _id: string;
  name: string;
  slug: string;
  category: string | null;
  form: string;
  unit: string;
  priceLow: number | null;
  priceHigh: number | null;
  qualityNote: string;
  referenceUrl: string;
  image: string;
  isFeatured: boolean;
  isActive: boolean;
};

export default function AdminItemEditPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params?.id;

  const [categories, setCategories] = React.useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
    if (!itemId) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, itemRes] = await Promise.all([
          fetch("/api/admin/categories", { cache: "no-store" }),
          fetch(`/api/admin/items/${itemId}`, { cache: "no-store" }),
        ]);

        const categoriesData = await categoriesRes.json();
        const itemData = await itemRes.json();

        if (!categoriesRes.ok) {
          throw new Error(
            categoriesData?.error || "Unable to load categories.",
          );
        }
        if (!itemRes.ok) {
          throw new Error(itemData?.error || "Unable to load item.");
        }

        setCategories(categoriesData);

        reset({
          name: itemData.name || "",
          slug: itemData.slug || "",
          category: itemData.category || "",
          form: itemData.form || "",
          unit: itemData.unit || "kg",
          priceLow: itemData.priceLow ?? null,
          priceHigh: itemData.priceHigh ?? null,
          qualityNote: itemData.qualityNote || "",
          referenceUrl: itemData.referenceUrl || "",
          image: itemData.image || "",
          isFeatured: Boolean(itemData.isFeatured),
          isActive: Boolean(itemData.isActive),
        });
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : String(fetchError),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [itemId, reset]);

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
    if (!itemId) return;
    setError(null);
    setSuccess(null);
    setIsSaving(true);

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

    const response = await fetch(`/api/admin/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data?.error || "Unable to update item.");
      setIsSaving(false);
      return;
    }

    setSuccess("Item updated successfully.");
    setIsSaving(false);
  };

  if (!itemId) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        Missing item ID.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Edit item
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">
              Update product details
            </h1>
            <p className="mt-2 text-sm leading-7 text-text-muted">
              Edit catalog metadata, pricing, and availability for this product.
            </p>
          </div>
          <Badge variant="outline">Item ID: {itemId}</Badge>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Category
            </label>
            <select
              className="mt-2 h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              {...register("category")}
              disabled={isLoading}
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
            <Input
              type="text"
              {...register("unit")}
              className="mt-2"
              disabled={isLoading}
            />
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Reference URL
            </label>
            <Input
              type="url"
              {...register("referenceUrl")}
              className="mt-2"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Image URL
            </label>
            <Input
              type="url"
              {...register("image")}
              className="mt-2"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Quality note
            </label>
            <Input
              type="text"
              {...register("qualityNote")}
              className="mt-2"
              disabled={isLoading}
            />
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
                  disabled={isLoading}
                />
                Featured
              </label>
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
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button type="submit" disabled={isSaving || isLoading}>
            {isSaving ? "Saving changes…" : "Save changes"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/admin/items")}
          >
            Back to items
          </Button>
        </div>
      </form>
    </div>
  );
}
