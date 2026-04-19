import { motion } from "framer-motion";
import { MessageCircle, Megaphone, ArrowUpRight } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="gradient-soft py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Contact
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Mulai Project Kamu
          </h2>
          <p className="mt-4 text-muted-foreground">
            Konsultasi gratis dan responsif. Pilih jalur yang paling nyaman buatmu.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.a
            href="https://wa.me/6285713317801"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft transition-smooth hover:shadow-elegant"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold">Konsultasi via WhatsApp</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Chat langsung dengan tim iboycloud untuk diskusi kebutuhan website
              kamu — gratis dan tanpa komitmen.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Buka WhatsApp
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </motion.a>

          <motion.a
            href="https://whatsapp.com/channel/0029Vb6brkG9cDDgITmNCH27"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft transition-smooth hover:shadow-elegant"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary shadow-soft">
              <Megaphone className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold">Gabung Saluran iboycloud</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Dapatkan update template, promo, dan tips web design langsung di
              WhatsApp Channel kami.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Gabung Channel
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
