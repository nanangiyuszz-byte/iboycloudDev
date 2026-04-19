import { Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full gradient-primary text-primary-foreground">
            <Cloud className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold">iboycloud</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 iboycloud. Built with Next.js & Passion.
        </p>
      </div>
    </footer>
  );
}
