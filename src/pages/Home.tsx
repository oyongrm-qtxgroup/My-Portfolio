import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { CertificationsAwards } from "@/components/sections/CertificationsAwards";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { SectionDivider } from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <main>
      <Hero />

      <SectionDivider variant="cyan-to-green" />
      <Projects />

      <SectionDivider variant="green-to-purple" />
      <Skills />

      <SectionDivider variant="purple-to-orange" flip />
      <Experience />

      <SectionDivider variant="orange-to-cyan" />
      <CertificationsAwards />

      <SectionDivider variant="cyan-to-pink" flip />
      <Blog />

      <SectionDivider variant="pink-to-green" />
      <Contact />
    </main>
  );
}
