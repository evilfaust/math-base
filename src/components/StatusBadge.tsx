import type { ProjectStatus } from "@/lib/projects";

const config: Record<ProjectStatus, { label: string; tone: string }> = {
  public: {
    label: "Live",
    tone: "var(--success)",
  },
  soon: {
    label: "Soon",
    tone: "var(--warning)",
  },
  private: {
    label: "Private",
    tone: "var(--text-muted)",
  },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, tone } = config[status];

  return (
    <span
      className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.16em]"
      style={{
        color: tone,
        border: `1px solid color-mix(in srgb, ${tone} 24%, transparent)`,
        background: `color-mix(in srgb, ${tone} 9%, transparent)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: tone,
          boxShadow: status === "public" ? `0 0 12px ${tone}` : "none",
        }}
      />
      {label}
    </span>
  );
}
