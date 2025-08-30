import Link from "next/link"
import { Github, Twitter, Globe, BookOpen } from "lucide-react"

const COLORS = {
  navy: "#0A1931",
  teal: "#1B5E68",
  coral: "#FF6B6B",
  lime: "#B9FF14",
  offwhite: "#E5F2E9",
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      className="w-full border-t"
      style={{
        backgroundColor: COLORS.navy,
        borderColor: COLORS.teal,
        color: COLORS.offwhite,
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Follow us</h3>
          <div className="flex gap-3">
            <Link href="https://twitter.com" className="inline-flex items-center gap-2 group" aria-label="Twitter">
              <Twitter size={20} className="opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">Twitter</span>
            </Link>
            <Link href="https://github.com" className="inline-flex items-center gap-2 group" aria-label="GitHub">
              <Github size={20} className="opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">GitHub</span>
            </Link>
            <Link href="https://craft-kit.ai" className="inline-flex items-center gap-2 group" aria-label="Website">
              <Globe size={20} className="opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">Website</span>
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Routing & Docs</h3>
          <ul className="text-sm space-y-1">
            <li>
              <Link href="/docs" className="hover:underline inline-flex items-center gap-2">
                <BookOpen size={18} />
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/docs/routing" className="hover:underline">
                Routing Guide
              </Link>
            </li>
            <li>
              <Link href="/docs/api" className="hover:underline">
                API Reference
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="text-sm space-y-1">
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: COLORS.teal }}>
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs flex items-center justify-between">
          <span style={{ color: COLORS.offwhite }}>&copy; {year} Craft‑Kit AI. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
