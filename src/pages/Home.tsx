import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { CertificationsAwards } from "@/components/sections/CertificationsAwards";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />

      <Projects />

      <Skills />

      <Experience />

      <CertificationsAwards />

      <Blog />

      <Contact />
    </main>
  );
}
