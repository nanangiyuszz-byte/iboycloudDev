import { motion } from "framer-motion";
import logoPrimary from "@/assets/logo-primary.png";
import logoSecondary from "@/assets/logo-secondary.png";
import logoAlternative from "@/assets/logo-alternative.png";

const cards = [
  {
    id: 1,
    title: "Primary Logo",
    desc: "Versi utama untuk header & branding resmi.",
    src: logoPrimary,
  },
  {
    id: 2,
    title: "Secondary Logo",
    desc: "Versi pendamping untuk konteks teknis & developer.",
    src: logoSecondary,
  },
  {
    id: 3,
    title: "Alternative Logo",
    desc: "Versi alternatif untuk banner & promosi.",
    src: logoAlternative,
  },
];

function LogoCard({
  title,
  desc,
  src,
  index,
}: {
  title: string;
  desc: string;
  src: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group hover-lift rounded-3xl border border-border bg-card p-6 shadow-soft"
    >
      <div className="relative mb-5 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary/60 transition-smooth group-hover:border-primary/40">
        <img
          src={src}
          alt={`${title} iboycloud`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

export default function Identity() {
  return (
    <section id="identity" className="py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Brand
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Our Identity
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tiga identitas visual resmi iboycloud — konsisten, modern, dan elegan.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <LogoCard key={c.id} title={c.title} desc={c.desc} src={c.src} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
