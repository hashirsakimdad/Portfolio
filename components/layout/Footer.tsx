"use client";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-[#FAFAFA]">Sakimdad Labs</p>
          <p className="mt-1 text-xs text-[#71717A]">
            Intelligence, engineered. · © 2025 Hashir Sakimdad
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          {[
            { href: "https://github.com/hashirsakimdad", label: "GitHub" },
            { href: "https://www.linkedin.com/in/hashir-sakimdad-8bbb22299/", label: "LinkedIn" },
            { href: "mailto:hashirsakimdad@gmail.com", label: "Email" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-xs text-[#71717A] transition-colors hover:text-[#FAFAFA]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <p className="font-mono text-[10px] text-[#52525B]">
          PAF-IAST · Islamabad
        </p>
      </div>
    </footer>
  );
}
