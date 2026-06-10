export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  category: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  href: string;
  gradient: string;
  accent: "cyan" | "purple" | "magenta" | "amber";
}

export interface Skill {
  name: string;
  category: string;
  level: number;
  icon: string;
  orbit: number;
}

export interface Experience {
  year: string;
  title: string;
  org: string;
  description: string;
  highlight?: string;
}

export interface FiverrStat {
  label: string;
  value: string;
  icon: string;
}
