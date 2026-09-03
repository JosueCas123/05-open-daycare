"use client";

import { useState } from "react";
import Link from "next/link";
import type { RoomId } from "@/lib/ninos-data";

type KidFormState = {
  name: string;
  birthDate: string;
  room: RoomId;
  allergies: string;
  notes: string;
};

const initialForm: KidFormState = {
  name: "",
  birthDate: "",
  room: "soles",
  allergies: "",
  notes: "",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-muted-strong">
      {children}
    </div>
  );
}

export function AddKidModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<KidFormState>(initialForm);

  const canSave = form.name.trim() !== "" && form.birthDate.trim() !== "";

  const update = (patch: Partial<KidFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-[14px] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white transition-opacity hover:opacity-90"
        style={{
          background: "linear-gradient(180deg,#F4977E,#EE8164)",
          boxShadow: "0 8px 18px -8px rgba(238,129,100,.7)",
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
        Agregar niño
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6 pt-10"
          style={{ background: "rgba(63,54,46,.4)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[520px] overflow-hidden rounded-[24px]"
            style={{
              background: "#FBF4EC",
              border: "1px solid #ECE0D0",
              boxShadow: "0 20px 50px -24px rgba(63,54,46,.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-[26px] py-5" style={{ borderColor: "#ECE0D0" }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer text-[15px] font-bold text-[#94887B]"
              >
                Cancelar
              </button>
              <span className="font-display text-[18px] font-semibold text-ink">
                Agregar niño
              </span>
              <Link
                href="#"
                aria-disabled={!canSave}
                className={`rounded-[12px] px-4 py-2 text-[15px] font-extrabold ${
                  canSave ? "text-coral-accent" : "text-[#C9BEB1]"
                }`}
                style={{ pointerEvents: canSave ? "auto" : "none" }}
              >
                Guardar
              </Link>
            </div>

            <div className="px-[26px] py-6">
              <FieldLabel>
                NOMBRE COMPLETO <span style={{ color: "#E0654A" }}>*</span>
              </FieldLabel>
              <input
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Ej. Martina López"
                className="mb-[18px] w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink outline-none"
                style={{ borderColor: "#EADFD0" }}
              />

              <div className="mb-[18px] flex gap-[14px]">
                <div className="flex-1">
                  <FieldLabel>
                    FECHA DE NACIMIENTO <span style={{ color: "#E0654A" }}>*</span>
                  </FieldLabel>
                  <input
                    value={form.birthDate}
                    onChange={(e) => update({ birthDate: e.target.value })}
                    placeholder="dd/mm/aaaa"
                    className="w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink outline-none"
                    style={{ borderColor: "#EADFD0" }}
                  />
                </div>
                <div className="flex-1">
                  <FieldLabel>
                    SALA <span style={{ color: "#E0654A" }}>*</span>
                  </FieldLabel>
                  <div
                    className="flex items-center gap-2 rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] font-bold text-ink"
                    style={{ borderColor: "#EADFD0" }}
                  >
                    Soles
                    <span className="flex-1" />
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#B0A290"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              <FieldLabel>ALERGIAS (ETIQUETAS)</FieldLabel>
              <input
                value={form.allergies}
                onChange={(e) => update({ allergies: e.target.value })}
                placeholder="Ej. Maní, Lactosa"
                className="mb-[18px] w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink outline-none"
                style={{ borderColor: "#EADFD0" }}
              />

              <FieldLabel>NOTAS MÉDICAS</FieldLabel>
              <textarea
                value={form.notes}
                onChange={(e) => update({ notes: e.target.value })}
                placeholder="Indicaciones, medicación, contactos…"
                className="w-full resize-y rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] leading-[1.5] text-ink outline-none"
                style={{ borderColor: "#EADFD0", minHeight: 90 }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
