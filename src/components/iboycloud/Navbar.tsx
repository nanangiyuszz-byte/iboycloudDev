import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

export default function Navbar() {
  const links = [
    { href: "#identity", label: "Identity" },
    { href: "#tech", label: "Tech" },
    { href: "#game", label: "Game" },
    { href: "#contact", label: "Kontak" },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(94%,72rem)]"
    >
      <nav className="glass flex items-center justify-between rounded-full px-4 py-2.5 shadow-soft sm:px-6">
        <a href="#" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full gradient-primary text-primary-foreground shadow-soft">
            <Cloud className="h-4 w-4" />
          </span>
          <span className="text-base">iboycloud</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleClick(e, l.href)}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={(e) => handleClick(e, "#contact")}
          className="rounded-full gradient-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-soft transition-smooth hover:shadow-glow sm:text-sm"
        >
          Pesan
        </a>
      </nav>
    </motion.header>
  );
}
