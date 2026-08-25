import Link from "next/link"
import { Leaf, Mail, MapPin, Phone } from "lucide-react"
import type { SVGProps } from "react"

const QUICK_LINKS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/rfq", label: "Request a Quote" },
  { href: "/about", label: "About Us" },
  { href: "/sourcing-standards", label: "Sourcing Standards" },
  { href: "/contact", label: "Contact" },
]

const CATEGORIES = [
  { name: "Premium Herbs", slug: "premium-herbs" },
  { name: "Seeds", slug: "seeds" },
  { name: "Fruits & Dry Materials", slug: "fruits-dry-materials" },
  { name: "Leaves", slug: "leaves" },
  { name: "Flowers", slug: "flowers" },
  { name: "Oils", slug: "oils" },
  { name: "Natural Ingredients", slug: "natural-ingredients" },
  { name: "Herbal Extracts", slug: "herbal-extracts" },
  { name: "Superfoods", slug: "superfoods" },
]

const SOCIALS = [
  {
    href: "#",
    label: "Facebook",
    Icon: (props: SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
        <path d="M13.5 21v-7h2.4l.36-2.8H13.5V9.4c0-.81.22-1.36 1.38-1.36h1.48V5.54c-.26-.03-1.13-.11-2.15-.11-2.13 0-3.59 1.3-3.59 3.69v2.08H8.2V14h2.42v7h2.88z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Instagram",
    Icon: (props: SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
        <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 5.8a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6zM16.7 8.2a.82.82 0 1 1-1.64 0 .82.82 0 0 1 1.64 0zM19 8.5a3.5 3.5 0 0 0-3.5-3.5h-7A3.5 3.5 0 0 0 5 8.5v7a3.5 3.5 0 0 0 3.5 3.5h7A3.5 3.5 0 0 0 19 15.5v-7zm-1.5 7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "LinkedIn",
    Icon: (props: SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
        <path d="M6.94 8.5v11H3.9v-11h3.04zM5.42 7.3a1.77 1.77 0 1 1 0-3.54 1.77 1.77 0 0 1 0 3.54zM20.1 12.98c0-2.7-1.44-3.96-3.36-3.96a2.91 2.91 0 0 0-2.62 1.44V8.5h-3.03v11h3.03v-5.44c0-1.43.27-2.82 2.05-2.82 1.75 0 1.93 1.64 1.93 2.91v5.35h3.04v-6.52z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary-dark text-[#fbf7f0]/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent-gold text-primary-dark">
                <Leaf className="size-5" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-heading text-[15px] font-semibold tracking-wide text-[#fbf7f0]">
                  YURVANA <span className="text-accent-gold">Grow</span>
                </span>
                <span className="mt-0.5 text-[10px] font-medium tracking-[0.22em] uppercase">
                  Raw Material Sourcing
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#fbf7f0]/60">
              Bulk supplier of certified Ayurvedic herbs, seeds, oils, extracts
              and natural ingredients for manufacturers and exporters across
              the globe.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((social) => {
                const Icon = social.Icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-full border border-[#fbf7f0]/15 text-[#fbf7f0]/70 transition-colors hover:border-accent-gold hover:text-accent-gold"
                  >
                    <Icon className="size-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-[#fbf7f0] uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#fbf7f0]/60 transition-colors hover:text-accent-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-[#fbf7f0] uppercase">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/catalog/${category.slug}`}
                    className="text-sm text-[#fbf7f0]/60 transition-colors hover:text-accent-gold"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-[#fbf7f0] uppercase">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#fbf7f0]/60">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent-gold" />
                <a href="mailto:info@yurvanaagro.com" className="hover:text-accent-gold">
                  info@yurvanagrow.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent-gold" />
                <a href="tel:+918929464846" className="hover:text-accent-gold">
                  +91 89294 64846
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent-gold" />
                <span>
                  YURVANA AGRO SOLUTIONS PVT. LTD.
                  <br />
                  Sourced across India · Head office, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#fbf7f0]/10 pt-6 text-xs text-[#fbf7f0]/40 sm:flex-row">
          <p>© {new Date().getFullYear()} YURVANA AGRO SOLUTIONS PVT. LTD.</p>
          <p>Certified botanicals · COA-backed · Bulk sourcing</p>
        </div>
      </div>
    </footer>
  )
}