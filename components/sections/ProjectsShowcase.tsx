"use client";

import { ProjectCard3D } from "@/components/ui/ProjectCard3D";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/lib/data/projects";

export function ProjectsShowcase() {
  return (
    <section id="products" className="section-pad relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Products"
          title="Shipped intelligence"
          subtitle="Production systems deployed across computer vision, fintech, robotics, and surveillance — each engineered for measurable outcomes."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={project.id === "proctor-ai" ? "lg:col-span-2" : ""}
            >
              <ProjectCard3D project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
