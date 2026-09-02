import Link from "next/link";
import type { Kid } from "@/lib/ninos-data";

interface KidCardProps {
  kid: Kid;
}

function Badge({ label }: { label: string }) {
  const style =
    label === "VINCULAR"
      ? { background: "#F9D2DE", color: "#C56486" }
      : { background: "#FBD8CC", color: "#D9684A" };

  return (
    <span
      className="flex-none rounded-full text-[11px] font-extrabold"
      style={{ padding: "5px 9px", ...style }}
    >
      {label}
    </span>
  );
}

function Chevron() {
  return (
    <svg
      className="flex-none"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#CBB89F"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function KidCard({ kid }: KidCardProps) {
  return (
    <Link
      href={`/kids/${kid.id}`}
      className="flex min-w-0 items-center gap-[14px] rounded-[18px] border border-line bg-card px-4 py-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[#F2A78E]"
    >
      <div
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full font-display text-[19px] font-semibold"
        style={{ background: kid.avatar.bg, color: kid.avatar.color }}
      >
        {kid.avatar.letter}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-[16px] font-semibold text-ink">
          {kid.name}
        </div>
        <div className="text-[13px] text-muted">
          {kid.ageInYears} años · {kid.parentCount}
        </div>
      </div>
      {kid.allergy ? <Badge label={kid.allergy} /> : <Chevron />}
    </Link>
  );
}
