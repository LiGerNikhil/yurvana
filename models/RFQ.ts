import mongoose, { model, models, type Model, type InferSchemaType } from "mongoose";

const rfqSchema = new mongoose.Schema(
  {
    rfqNumber: { type: Number, required: true, unique: true },
    company: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "quoted", "approved", "rejected", "closed"],
      default: "new",
      index: true,
    },
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        name: { type: String, required: true, trim: true },
        unit: { type: String, trim: true, default: "kg" },
        quantity: { type: Number, required: true, min: 0 },
        targetPrice: { type: Number, min: 0, default: null },
      },
    ],
    createdAt: { type: Date, index: true },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

rfqSchema.index({ status: 1, createdAt: -1 });

export type RFQItemDoc = InferSchemaType<typeof rfqSchema> extends {
  items: (infer I)[];
}
  ? I
  : never;

export type RFQDoc = InferSchemaType<typeof rfqSchema>;

export const RFQ: Model<RFQDoc> =
  (models.RFQ as Model<RFQDoc> | undefined) ??
  model<RFQDoc>("RFQ", rfqSchema);