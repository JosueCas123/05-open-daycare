"use client";

import { useState } from "react";
import Link from "next/link";

type ParentFormState = {
  parentName: string;
  email: string;
  relation: "Mamá" | "Papá" | "Tutor/a";
};

interface LinkParentModalProps {
  kidName: string;
}

const RELATIONS: ParentFormState["relation"][] = ["Mamá", "Papá", "Tutor/a"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-muted-strong">
      {children}
    </div>
  );
}

export function LinkParentModal({ kidName }: LinkParentModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ParentFormState>({
    parentName: "",
    email: "",
    relation: "Mamá",
  });

  const update = (patch: Partial<ParentFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const emailTouched = form.email.length > 0;
  const emailInvalid = emailTouched && !EMAIL_REGEX.test(form.email);
  const canSend =
    form.parentName.trim() !== "" &&
    form.email.trim() !== "" &&
    EMAIL_REGEX.test(form.email);

  const openModal = () => {
    setForm({ parentName: "", email: "", relation: "Mamá" });
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex cursor-pointer items-center gap-3 pb-0 pt-2 text-left"
      >
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
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
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="text-[14.5px] font-extrabold text-coral-dark">
          Vincular otro padre
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6 pt-10"
          style={{ background: "rgba(63,54,46,.4)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[480px] overflow-hidden rounded-[24px]"
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
              <div>
                <div className="font-display text-[18px] font-semibold text-ink">
                  Vincular padre
                </div>
                <div className="text-[13px] text-muted">a {kidName}</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] bg-[#F0E6D8] text-[#94887B]"
                aria-label="Cerrar"
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
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-[26px] py-[22px]">
              <div
                className="mb-5 flex gap-[11px] rounded-[14px] px-4 py-[13px]"
                style={{ background: "#E3ECFB" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4E72C8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-[1px] flex-none"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span
                  className="text-[13.5px] leading-[1.45]"
                  style={{ color: "#3F5694" }}
                >
                  Le enviaremos un correo con un código para que active su
                  cuenta. Solo verá el feed de Mateo.
                </span>
              </div>

              <FieldLabel>NOMBRE DEL PADRE/MADRE</FieldLabel>
              <input
                value={form.parentName}
                onChange={(e) => update({ parentName: e.target.value })}
                placeholder="Ej. Diego Fernández"
                className="mb-[18px] w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink outline-none"
                style={{ borderColor: "#EADFD0" }}
              />

              <FieldLabel>EMAIL</FieldLabel>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink outline-none"
                style={{
                  borderColor: emailInvalid ? "#E0654A" : "#EADFD0",
                  marginBottom: emailInvalid ? 8 : 18,
                }}
              />
              {emailInvalid && (
                <div
                  className="mb-[10px] text-[12.5px] font-bold"
                  style={{ color: "#E0654A" }}
                >
                  Ingresá un email válido
                </div>
              )}

              <div className="mb-[10px]">
                <FieldLabel>PARENTESCO</FieldLabel>
              </div>
              <div className="mb-5 flex gap-[9px]">
                {RELATIONS.map((relation) => {
                  const active = form.relation === relation;
                  return (
                    <button
                      key={relation}
                      type="button"
                      onClick={() => update({ relation })}
                      className="flex-1 cursor-pointer rounded-[999px] border-[1.5px] py-[11px] text-[14px] font-extrabold"
                      style={
                        active
                          ? {
                              borderColor: "#9FB8EC",
                              background: "#CCD8F4",
                              color: "#4E72C8",
                            }
                          : {
                              borderColor: "#ECE0D0",
                              background: "#FFFDF9",
                              color: "#6E6359",
                            }
                      }
                    >
                      {relation}
                    </button>
                  );
                })}
              </div>

              <div
                className="mb-5 rounded-[16px] p-[18px] text-center"
                style={{
                  background: "#FBF1D6",
                  border: "1.5px dashed #E6D08A",
                }}
              >
                <div
                  className="mb-2 text-[12px] font-extrabold tracking-[.7px]"
                  style={{ color: "#A88526" }}
                >
                  CÓDIGO DE INVITACIÓN
                </div>
                <div
                  className="font-display text-[34px] font-semibold tracking-[7px]"
                  style={{ color: "#8A7234" }}
                >
                  7K4P9
                </div>
                <div className="mt-[6px] text-[13px]" style={{ color: "#A88526" }}>
                  Vence en 7 días
                </div>
              </div>

              <Link
                href="#"
                aria-disabled={!canSend}
                className={`flex w-full items-center justify-center gap-[9px] rounded-[14px] px-4 py-[14px] text-[15.5px] font-extrabold ${
                  canSend ? "text-white" : "text-white/70"
                }`}
                style={{
                  background: canSend
                    ? "linear-gradient(180deg,#F4977E,#EE8164)"
                    : "linear-gradient(180deg,#E8D9C7,#DFCCB6)",
                  boxShadow: canSend
                    ? "0 10px 22px -8px rgba(238,129,100,.7)"
                    : "none",
                  pointerEvents: canSend ? "auto" : "none",
                }}
                onClick={() => setOpen(false)}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4z" />
                  <path d="M22 2 11 13" />
                </svg>
                Enviar invitación
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
