import { Sidebar } from "@/components/sidebar";
import { KidCard } from "@/components/kid-card";
import { AddKidModal } from "@/components/add-kid-modal";
import { kids } from "@/lib/ninos-data";

export default function KidsPage() {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar active="ninos" />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[880px] px-10 pb-20 pt-[34px]">
          <div className="mb-[22px] flex items-end justify-between gap-4">
            <div>
              <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-coral-accent">
                GESTIÓN
              </div>
              <h1 className="m-0 font-display text-[30px] font-semibold text-ink">
                Niños
              </h1>
            </div>
            <AddKidModal />
          </div>

          <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-line bg-card px-4 py-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B0A290"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              placeholder="Buscar niño…"
              className="w-full flex-1 bg-transparent text-[15px] text-ink outline-none"
            />
          </div>

          <div className="mb-[14px] flex items-center gap-3">
            <span className="text-[12.5px] font-extrabold tracking-[.8px] text-ink">
              SALA SOLES
            </span>
            <span className="text-[13px] text-muted">{kids.length} niños</span>
            <span className="h-px flex-1 bg-divider" />
          </div>

          <div className="grid grid-cols-2 gap-[14px]">
            {kids.map((kid) => (
              <KidCard key={kid.id} kid={kid} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
