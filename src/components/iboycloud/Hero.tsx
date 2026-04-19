import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden gradient-hero pt-28 pb-24 md:pt-36 md:pb-32">
      {/* decorative blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-primary shadow-soft"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Premium web design — terjangkau untuk pelajar & UMKM
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
        >
          Website Mewah,{" "}
          <span className="text-gradient">Dana Pelajar.</span>{" "}
          <br className="hidden sm:inline" />
          Mulai 30K.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          Solusi website modern, responsif, dan elegan untuk pelajar & UMKM.
          Dibuat dengan presisi oleh <span className="font-semibold text-foreground">iboycloud</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => scrollTo("contact")}
            className="group h-12 rounded-full px-7 gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
          >
            Pesan Sekarang
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("tech")}
            className="h-12 rounded-full px-7 border-border/80 bg-white/60 backdrop-blur hover:bg-white"
          >
            Lihat Tech Stack
          </Button>
        </motion.div>

        {/* floating mini stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-3 sm:gap-6"
        >
          {[
            { k: "30K+", v: "Mulai dari" },
            { k: "100%", v: "Responsif" },
            { k: "24/7", v: "Support" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-2xl px-4 py-5 shadow-soft">
              <div className="text-2xl font-bold text-gradient md:text-3xl">{s.k}</div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
