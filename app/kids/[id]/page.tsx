import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { KidProfile } from "@/components/kid-profile";
import { kids } from "@/lib/ninos-data";

export default async function KidProfilePage({
  params,
}: PageProps<"/kids/[id]">) {
  const { id } = await params;
  const kid = kids.find((k) => k.id === id);

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar active="ninos" />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[820px] px-10 pb-20 pt-[34px]">
          <Link
            href="/kids"
            className="mb-5 flex items-center gap-[7px] text-[14px] font-bold text-muted-strong"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Volver a Niños
          </Link>

          {kid ? (
            <KidProfile kid={kid} />
          ) : (
            <div className="rounded-2xl border border-line bg-card px-6 py-10 text-center">
              <div className="font-display text-[22px] font-semibold text-ink">
                No encontrado
              </div>
              <p className="mt-2 text-[14.5px] text-muted">
                No existe un niño con este identificador.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
