import mongoose, { model, models, type Model, type InferSchemaType } from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    sr: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    categoryName: { type: String, trim: true, index: true },
    form: { type: String, trim: true, default: "" },
    unit: { type: String, trim: true, default: "kg" },
    priceLow: { type: Number, min: 0 },
    priceHigh: { type: Number, min: 0 },
    qualityNote: { type: String, default: "" },
    referenceUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    priceUpdatedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export type ItemDoc = InferSchemaType<typeof itemSchema>;

export const Item: Model<ItemDoc> =
  (models.Item as Model<ItemDoc> | undefined) ??
  model<ItemDoc>("Item", itemSchema);