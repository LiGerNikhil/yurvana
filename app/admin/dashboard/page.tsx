import { dbConnect } from "@/lib/db";
import { Category } from "@/models/Category";
import { Item } from "@/models/Item";
import { RFQ } from "@/models/RFQ";

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
        {label}
      </p>
      <p className="mt-4 text-4xl font-semibold text-text-primary">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  await dbConnect();

  const [totalItems, totalCategories, pendingRFQs, updatedLast7Days] =
    await Promise.all([
      Item.countDocuments({ isActive: true }),
      Category.countDocuments(),
      RFQ.countDocuments({ status: "new" }),
      Item.countDocuments({
        priceUpdatedAt: {
          $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        },
      }),
    ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active items" value={totalItems} />
        <MetricCard label="Categories" value={totalCategories} />
        <MetricCard label="Pending RFQs" value={pendingRFQs} />
        <MetricCard label="Updated last 7 days" value={updatedLast7Days} />
      </div>
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-text-primary">
          Admin overview
        </h2>
        <p className="mt-3 text-sm leading-7 text-text-muted">
          Use the navigation to manage inventory, pricing and category data.
          Price updates are reflected immediately and pending RFQs are counted
          from new leads.
        </p>
      </div>
    </div>
  );
}
