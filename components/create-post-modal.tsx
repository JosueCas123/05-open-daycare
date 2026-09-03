"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { kids } from "@/lib/ninos-data";

type PostTypeOption =
  | "comida"
  | "siesta"
  | "actividad"
  | "logro"
  | "animo"
  | "foto"
  | "anuncio";

interface TypeStyle {
  label: string;
  bg: string;
  color: string;
}

const TYPE_OPTIONS: Record<PostTypeOption, TypeStyle> = {
  comida: { label: "Comida", bg: "#9A7B1E", color: "#fff" },
  siesta: { label: "Siesta", bg: "#E7DCF6", color: "#7B5FC0" },
  actividad: { label: "Actividad", bg: "#2E89A6", color: "#fff" },
  logro: { label: "Logro", bg: "#CFEBD8", color: "#3E9B6C" },
  animo: { label: "Ánimo", bg: "#F9D2DE", color: "#C56486" },
  foto: { label: "Foto", bg: "#FBD8CC", color: "#D9684A" },
  anuncio: { label: "Anuncio", bg: "#CCD8F4", color: "#4E72C8" },
};

interface CreatePostModalProps {
  trigger: ReactNode;
}

export function CreatePostModal({ trigger }: CreatePostModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedKids, setSelectedKids] = useState<string[]>([]);
  const [type, setType] = useState<PostTypeOption | null>(null);
  const [description, setDescription] = useState("");

  const allSelected = kids.length > 0 && selectedKids.length === kids.length;

  const toggleKid = (id: string) => {
    setSelectedKids((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedKids(allSelected ? [] : kids.map((kid) => kid.id));
  };

  const toggleType = (option: PostTypeOption) => {
    setType((prev) => (prev === option ? null : option));
  };

  const reset = () => {
    setSelectedKids([]);
    setType(null);
    setDescription("");
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const canPublish =
    type !== null && selectedKids.length > 0 && description.trim() !== "";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] px-3 py-3 text-[14.5px] font-extrabold text-white"
        style={{
          background: "linear-gradient(180deg,#F4977E,#EE8164)",
          boxShadow: "0 8px 18px -8px rgba(238,129,100,.75)",
        }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nueva publicación
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6"
          style={{ background: "rgba(63,54,46,.4)" }}
          onClick={close}
        >
          <div
            className="relative mt-8 w-full max-w-[580px] overflow-hidden rounded-3xl"
            style={{
              background: "#FBF4EC",
              border: "1px solid #ECE0D0",
              boxShadow: "0 20px 50px -24px rgba(63,54,46,.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-[26px] py-5"
              style={{ borderBottom: "1px solid #ECE0D0" }}
            >
              <button
                type="button"
                onClick={close}
                className="text-[15px] font-bold text-[#94887B]"
              >
                Cancelar
              </button>
              <span className="font-display text-[18px] font-semibold text-[#3F362E]">
                Nueva publicación
              </span>
              <button
                type="button"
                disabled={!canPublish}
                onClick={close}
                className="text-[15px] font-extrabold disabled:cursor-not-allowed"
                style={{
                  color: canPublish ? "#D9583C" : "#C9BCAE",
                  opacity: canPublish ? 1 : 1,
                }}
              >
                Publicar
              </button>
            </div>

            <div className="px-[26px] py-6">
              <SectionLabel>Para</SectionLabel>
              <div className="mb-[22px] flex flex-wrap gap-[9px]">
                {kids.map((kid) => {
                  const isActive = selectedKids.includes(kid.id);
                  return (
                    <button
                      key={kid.id}
                      type="button"
                      onClick={() => toggleKid(kid.id)}
                      className="flex items-center gap-2 rounded-full py-[6px] pl-[6px] pr-[14px] text-[14px] font-bold"
                      style={
                        isActive
                          ? {
                              background: "#3F362E",
                              color: "#fff",
                              border: "1.5px solid #3F362E",
                            }
                          : {
                              background: "#FFFDF9",
                              color: "#6E6359",
                              border: "1.5px solid #ECE0D0",
                            }
                      }
                    >
                      <span
                        className="font-display flex h-[26px] w-[26px] items-center justify-center rounded-full text-[13px] font-semibold"
                        style={{
                          background: kid.avatar.bg,
                          color: kid.avatar.color,
                        }}
                      >
                        {kid.avatar.letter}
                      </span>
                      {kid.name.split(" ")[0]}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={toggleAll}
                  className="rounded-full px-4 py-[6px] text-[14px] font-bold"
                  style={
                    allSelected
                      ? {
                          background: "#3F362E",
                          color: "#fff",
                          border: "1.5px solid #3F362E",
                        }
                      : {
                          background: "#FFFDF9",
                          color: "#6E6359",
                          border: "1.5px solid #ECE0D0",
                        }
                  }
                >
                  Toda la sala
                </button>
              </div>

              <SectionLabel>Tipo</SectionLabel>
              <div className="mb-[22px] flex flex-wrap gap-[9px]">
                {(Object.keys(TYPE_OPTIONS) as PostTypeOption[]).map(
                  (key) => {
                    const option = TYPE_OPTIONS[key];
                    const isActive = type === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleType(key)}
                        className={`rounded-full px-4 py-2 text-[13.5px] font-extrabold ${
                          isActive ? "ring-2 ring-[#3F362E] ring-offset-1" : ""
                        }`}
                        style={{
                          background: option.bg,
                          color: option.color,
                        }}
                      >
                        {option.label}
                      </button>
                    );
                  },
                )}
              </div>

              <SectionLabel>Descripción</SectionLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contá cómo le fue hoy…"
                className="mb-[22px] w-full resize-y rounded-[14px] border-[1.5px] px-4 py-[14px] text-[15px] leading-relaxed text-[#3F362E] focus:outline-none"
                style={{ minHeight: 120, borderColor: "#EADFD0", background: "#fff" }}
              />

              <SectionLabel>Fotos</SectionLabel>
              <div className="flex gap-3">
                <div className="flex h-24 w-24 items-center justify-center rounded-[14px] text-[#CBB89F]"
                  style={{ background: "#F4ECE1", border: "1px solid #ECE0D0" }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
                  </svg>
                </div>
                <div
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] text-[#B0A290]"
                  style={{ border: "1.5px dashed #DBCDBA", background: "#F4ECE1" }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C5503A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-xs">Agregar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-[10px] text-[12px] font-extrabold uppercase tracking-[.7px] text-[#94887B]"
    >
      {children}
    </div>
  );
}
