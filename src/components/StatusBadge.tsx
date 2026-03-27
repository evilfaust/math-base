import type { ProjectStatus } from "@/lib/projects";

const config: Record<ProjectStatus, { label: string; dot: string; className: string }> = {
  public: {
    label: "Live",
    dot: "bg-emerald-400",
    className: "bg-emerald-500/8 text-emerald-400 border border-emerald-500/15",
  },
  soon: {
    label: "Soon",
    dot: "bg-amber-400",
    className: "bg-amber-500/8 text-amber-400 border border-amber-500/15",
  },
  private: {
    label: "Private",
    dot: "bg-zinc-500",
    className: "bg-zinc-800/50 text-zinc-500 border border-zinc-700/50",
  },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, dot, className } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot} ${status === "public" ? "animate-pulse" : ""}`}
      />
      {label}
    </span>
  );
}
