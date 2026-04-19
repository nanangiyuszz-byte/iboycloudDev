import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/iboycloud/Navbar";
import Hero from "@/components/iboycloud/Hero";
import Identity from "@/components/iboycloud/Identity";
import TechStack from "@/components/iboycloud/TechStack";
import Game from "@/components/iboycloud/Game";
import Contact from "@/components/iboycloud/Contact";
import Footer from "@/components/iboycloud/Footer";
import ChatWidget from "@/components/iboycloud/ChatWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iboycloud — Website Mewah, Dana Pelajar. Mulai 30K." },
      {
        name: "description",
        content:
          "Solusi website modern, responsif, dan elegan untuk pelajar & UMKM. Dibuat dengan presisi oleh iboycloud.",
      },
      { property: "og:title", content: "iboycloud — Website Mewah Mulai 30K" },
      {
        property: "og:description",
        content:
          "Website modern & responsif untuk pelajar dan UMKM. Konsultasi gratis via WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Identity />
        <TechStack />
        <Game />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
