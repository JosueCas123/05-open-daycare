import type { Kid, ParentLink } from "@/lib/ninos-data";
import { roomName } from "@/lib/ninos-data";
import { LinkParentModal } from "@/components/link-parent-modal";

interface KidProfileProps {
  kid: Kid;
}

function ParentRow({ parent }: { parent: ParentLink }) {
  const avatarStyle =
    parent.status === "activa"
      ? { background: "#C9B6E8" }
      : { background: "#A9C7E8" };
  const badgeStyle =
    parent.status === "activa"
      ? { background: "#CFEBD8", color: "#3E9B6C", label: "ACTIVA" }
      : { background: "#F7E7A6", color: "#9A7B1E", label: "PENDIENTE" };

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-display text-[16px] font-semibold text-white"
        style={avatarStyle}
      >
        {parent.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14.5px] font-extrabold text-ink">
          {parent.name}
        </div>
        <div className="text-[12.5px] text-muted">{parent.relation}</div>
      </div>
      <span
        className="flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold"
        style={{ background: badgeStyle.background, color: badgeStyle.color }}
      >
        {badgeStyle.label}
      </span>
    </div>
  );
}

export function KidProfile({ kid }: KidProfileProps) {
  return (
    <div className="flex flex-wrap items-start gap-[26px]">
      <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
        <div className="flex items-center gap-[18px]">
          <div
            className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-full font-display text-[34px] font-semibold"
            style={{ background: kid.avatar.bg, color: kid.avatar.color }}
          >
            {kid.avatar.letter}
          </div>
          <div className="flex-1">
            <h1 className="m-0 font-display text-[28px] font-semibold text-ink">
              {kid.name}
            </h1>
            <p className="mt-[3px] text-[15px] text-muted-strong">
              {kid.ageInYears} años · {roomName[kid.room]}
            </p>
          </div>
          <a
            href="#"
            className="rounded-xl border-[1.5px] border-line bg-card px-4 py-[9px] text-[14px] font-bold text-muted-nav"
          >
            Editar
          </a>
        </div>

        <div className="flex gap-[14px] rounded-2xl bg-[#FBDAD6] px-[18px] py-4">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </div>
          <div>
            <div className="mb-0.5 text-[15px] font-extrabold text-[#C5413A]">
              {kid.notes.title}
            </div>
            <div className="text-[14.5px] leading-relaxed text-[#B25249]">
              {kid.notes.body}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-card">
          <div className="flex justify-between border-b border-card-divider px-[18px] py-[15px]">
            <span className="text-[14.5px] text-muted-strong">
              Fecha de nacimiento
            </span>
            <span className="text-[14.5px] font-extrabold text-ink">
              {kid.birthDate}
            </span>
          </div>
          <div className="flex justify-between border-b border-card-divider px-[18px] py-[15px]">
            <span className="text-[14.5px] text-muted-strong">Sala</span>
            <span className="text-[14.5px] font-extrabold text-ink">
              Soles
            </span>
          </div>
          <div className="flex justify-between px-[18px] py-[15px]">
            <span className="text-[14.5px] text-muted-strong">Ingreso</span>
            <span className="text-[14.5px] font-extrabold text-ink">
              {kid.enrollment}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-[300px] flex-none flex-col gap-[14px]">
        <a
          href="#"
          className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-ink px-4 py-[13px] text-[15px] font-extrabold text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          Resumen del día
        </a>

        <div className="rounded-2xl border border-line bg-card px-[18px] py-4">
          <div className="mb-[14px] text-[12.5px] font-extrabold tracking-[.8px] text-muted-label">
            PADRES VINCULADOS
          </div>
          <div className="flex flex-col gap-[14px]">
            {kid.parents.map((parent) => (
              <ParentRow key={parent.id} parent={parent} />
            ))}
            <LinkParentModal kidName={kid.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
