import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact | YURVANA AGRO",
  description:
    "Contact YURVANA AGRO for product inquiries, sourcing support and bulk herbal raw material orders.",
};

export default function ContactPage() {
  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ContactForm />
      </div>
    </main>
  );
}
