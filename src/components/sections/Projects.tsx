import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  Clock,
  Zap,
  ChevronRight,
  Sparkles,
  Layers,
  Link2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects, useProjectIndustries } from "@/hooks/useProjects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { PillBadge } from "@/components/ui/PillBadge";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import type { Project } from "@/types";

/* ── Industry → accent color mapping ─────────────── */
const industryColors: Record<string, string> = {
  "AI/ML": "border-l-accent-cyan",
  Healthcare: "border-l-accent-green",
  Finance: "border-l-accent-orange",
  NLP: "border-l-accent-purple",
  Vision: "border-l-accent-pink",
  Education: "border-l-accent-yellow",
};

const impactVariant: Record<string, "green" | "cyan" | "orange" | "muted"> = {
  "Very High": "green",
  High: "cyan",
  Medium: "orange",
};

const difficultyVariant: Record<string, "purple" | "cyan" | "muted"> = {
  Advanced: "purple",
  Intermediate: "cyan",
  Beginner: "muted",
};

/* ── Detail Panel Tab Type ────────────────────────── */
type DetailTab = "overview" | "tech" | "links";

/* ── Sidebar project card ─────────────────────────── */
function ProjectSidebarItem({
  project,
  isActive,
  onClick,
}: {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}) {
  const borderColor =
    industryColors[project.industry ?? ""] ?? "border-l-border-glow";

  return (
    <motion.button
      layout
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-lg border-l-2 p-4 transition-all duration-200",
        "hover:translate-x-1 hover:bg-bg-elevated/60",
        borderColor,
        isActive
          ? "bg-bg-elevated border-l-accent-cyan shadow-glow-cyan/10"
          : "bg-transparent border-l-opacity-40",
      )}
      whileTap={{ scale: 0.98 }}
    >
      {/* Industry label */}
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          {project.industry ?? "General"}
        </span>
        {project.is_new && <PillBadge label="New" variant="green" size="sm" />}
      </div>

      {/* Title */}
      <h3
        className={cn(
          "text-sm font-semibold transition-colors",
          isActive ? "text-text-primary" : "text-text-secondary",
        )}
      >
        {project.title}
      </h3>

      {/* Tagline */}
      {project.tagline && (
        <p className="mt-0.5 text-xs text-text-muted line-clamp-1">
          {project.tagline}
        </p>
      )}

      {/* Bottom badge row */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {project.difficulty && (
          <PillBadge
            label={project.difficulty}
            variant={difficultyVariant[project.difficulty] ?? "muted"}
            size="sm"
          />
        )}
        {project.build_time && (
          <PillBadge
            label={project.build_time}
            variant="muted"
            size="sm"
            icon={<Clock />}
          />
        )}
      </div>

      {/* Arrow indicator when active */}
      <ChevronRight
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-cyan transition-opacity",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50",
        )}
      />
    </motion.button>
  );
}

/* ── Detail panel ─────────────────────────────────── */
function ProjectDetailPanel({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <Sparkles className="h-3.5 w-3.5" />,
    },
    {
      id: "tech",
      label: "Tech Stack",
      icon: <Layers className="h-3.5 w-3.5" />,
    },
    { id: "links", label: "Links", icon: <Link2 className="h-3.5 w-3.5" /> },
  ];

  const borderColor =
    industryColors[project.industry ?? ""] ?? "border-l-border-glow";

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className={cn(
        "rounded-xl border border-[--color-border-custom] bg-bg-elevated overflow-hidden",
        "border-l-2",
        borderColor,
      )}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            {project.industry ?? "General"}
          </span>
          {project.featured && (
            <PillBadge label="Featured" variant="cyan" size="sm" glow />
          )}
          {project.is_new && (
            <PillBadge label="New" variant="green" size="sm" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-text-primary">
          {project.title}
        </h2>

        {project.tagline && (
          <p className="mt-1 text-text-secondary">{project.tagline}</p>
        )}

        {/* Impact / Difficulty / Build time pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.impact && (
            <PillBadge
              label={`Impact: ${project.impact}`}
              variant={impactVariant[project.impact] ?? "muted"}
              icon={<Zap />}
            />
          )}
          {project.difficulty && (
            <PillBadge
              label={project.difficulty}
              variant={difficultyVariant[project.difficulty] ?? "muted"}
            />
          )}
          {project.build_time && (
            <PillBadge
              label={project.build_time}
              variant="muted"
              icon={<Clock />}
            />
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-t border-b border-[--color-border-custom] px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-3 font-mono text-xs transition-colors",
                activeTab === tab.id
                  ? "text-accent-cyan"
                  : "text-text-muted hover:text-text-secondary",
              )}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="project-tab-indicator"
                  className="absolute inset-x-0 -bottom-px h-px bg-accent-cyan"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6 min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {project.description ? (
                <p className="text-text-secondary leading-relaxed">
                  {project.description}
                </p>
              ) : (
                <p className="text-text-muted italic">
                  No description available.
                </p>
              )}

              {/* Thumbnail */}
              {project.thumbnail_url && (
                <div className="mt-6 overflow-hidden rounded-lg border border-[--color-border-custom]">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "tech" && (
            <motion.div
              key="tech"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {project.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <PillBadge key={tag} label={tag} variant="cyan" />
                  ))}
                </div>
              ) : (
                <p className="text-text-muted italic">No tech stack listed.</p>
              )}
            </motion.div>
          )}

          {activeTab === "links" && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[--color-border-custom] bg-bg-secondary p-4 transition-all hover:border-accent-cyan/40 hover:bg-bg-elevated"
                >
                  <ExternalLink className="h-5 w-5 text-accent-cyan" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Live Demo
                    </p>
                    <p className="text-xs text-text-muted truncate max-w-xs">
                      {project.demo_url}
                    </p>
                  </div>
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[--color-border-custom] bg-bg-secondary p-4 transition-all hover:border-accent-cyan/40 hover:bg-bg-elevated"
                >
                  <Github className="h-5 w-5 text-text-secondary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Source Code
                    </p>
                    <p className="text-xs text-text-muted truncate max-w-xs">
                      {project.github_url}
                    </p>
                  </div>
                </a>
              )}
              {!project.demo_url && !project.github_url && (
                <p className="text-text-muted italic">No links available.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Empty state ──────────────────────────────────── */
function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[--color-border-custom] bg-bg-elevated">
        <Layers className="h-7 w-7 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">
        No projects found
      </h3>
      <p className="mt-1 text-sm text-text-muted">
        {filter !== "All"
          ? `No projects in the "${filter}" category yet.`
          : "Projects will appear here once added."}
      </p>
    </div>
  );
}

/* ── Mobile detail overlay ────────────────────────── */
function MobileDetailOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm lg:hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-[--color-border-custom] bg-bg-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close handle */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[--color-border-custom] bg-bg-primary/90 backdrop-blur-sm px-4 py-3">
          <span className="font-mono text-xs text-text-muted uppercase tracking-widest">
            Project Details
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ProjectDetailPanel project={project} />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PROJECTS SECTION
   ═══════════════════════════════════════════════════════ */
export function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailProject, setMobileDetailProject] =
    useState<Project | null>(null);

  const industries = useProjectIndustries();
  const { projects, loading, error } = useProjects(activeFilter);

  // Default to first project when list loads or filter changes
  const selectedProject = useMemo(() => {
    if (!projects.length) return null;
    return projects.find((p) => p.id === selectedId) ?? projects[0];
  }, [projects, selectedId]);

  const handleSelectProject = (project: Project) => {
    setSelectedId(project.id);
    // On mobile, show overlay
    if (window.innerWidth < 1024) {
      setMobileDetailProject(project);
    }
  };

  return (
    <section id="projects" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Projects"
          title="Featured Work"
          subtitle="A curated collection of AI/ML projects — from LLM orchestration to computer vision pipelines."
        />

        {/* Filter bar */}
        {industries.length > 0 && (
          <FilterBar
            filters={industries}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            className="mb-8"
          />
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingShimmer
                  key={i}
                  lines={3}
                  className="rounded-lg border border-[--color-border-custom] bg-bg-elevated p-4"
                />
              ))}
            </div>
            <LoadingShimmer
              lines={8}
              className="rounded-xl border border-[--color-border-custom] bg-bg-elevated p-6"
            />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-xl border border-accent-pink/30 bg-accent-pink/5 p-6 text-center">
            <p className="text-accent-pink font-medium">
              Failed to load projects
            </p>
            <p className="mt-1 text-sm text-text-muted">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <EmptyState filter={activeFilter} />
        )}

        {/* Main content: sidebar + detail panel */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            {/* Sidebar list */}
            <div className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2 no-scrollbar">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut" as const,
                  }}
                >
                  <ProjectSidebarItem
                    project={project}
                    isActive={selectedProject?.id === project.id}
                    onClick={() => handleSelectProject(project)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Detail panel — desktop only */}
            <div className="hidden lg:block">
              <AnimatePresence mode="wait">
                {selectedProject && (
                  <ProjectDetailPanel project={selectedProject} />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Mobile detail overlay */}
        <AnimatePresence>
          {mobileDetailProject && (
            <MobileDetailOverlay
              project={mobileDetailProject}
              onClose={() => setMobileDetailProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
