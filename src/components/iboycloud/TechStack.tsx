import { motion } from "framer-motion";
import { techStack } from "./TechIcons";

export default function TechStack() {
  return (
    <section id="tech" className="gradient-soft py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Capabilities
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Tech Capabilities
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tools & framework yang kami gunakan untuk membangun website cepat,
            modern, dan scalable.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {techStack.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <div
                className="h-12 w-12 animate-float-y transition-smooth group-hover:scale-125 group-hover:drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {t.icon}
              </div>
              <span className="mt-3 text-sm font-medium text-foreground">
                {t.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
