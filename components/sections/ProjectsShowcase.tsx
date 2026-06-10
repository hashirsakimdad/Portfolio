"use client";

import { ProjectCard3D } from "@/components/ui/ProjectCard3D";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/lib/data/projects";

export function ProjectsShowcase() {
  return (
    <section
      id="projects"
      className="relative px-6 py-28 md:px-12 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="// Experiment Archive"
          title="AI Projects Showcase"
          subtitle="Production systems deployed in the real world — not tutorials."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={i === 0 ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <ProjectCard3D project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
