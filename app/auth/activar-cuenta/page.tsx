import Link from "next/link";
import { sala } from "@/lib/feed-data";

export default function ActivarCuentaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-login-bg p-10">
      <div className="w-full max-w-[440px]">
        <div
          className="mb-[22px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px] shadow-[0_12px_26px_-10px_rgba(238,129,100,.65)]"
          style={{
            background: "linear-gradient(155deg,#F8C3A8,#F2937A)",
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </div>

        <h1 className="m-0 mb-2 font-display text-[32px] font-semibold leading-[1.15] text-ink">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mt-0 mb-[26px] text-[15.5px] leading-[1.55] text-login-subtext">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar
          la cuenta.
        </p>

        <div className="mb-[22px] flex items-center gap-[14px] rounded-[16px] border-[1.5px] border-login-input-border bg-login-input-bg px-4 py-[14px]">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-actividad-avatar-bg font-display text-[19px] font-semibold text-actividad-avatar-text">
            M
          </div>
          <div>
            <div className="text-[13px] text-login-subtext">
              Te invitaron a seguir a
            </div>
            <div className="font-display text-[17px] font-semibold text-ink">
              Mateo · {sala.brand.room}
            </div>
          </div>
        </div>

        <div className="mb-2 text-[12px] font-bold tracking-[.7px] text-login-label">
          CÓDIGO DE INVITACIÓN
        </div>
        <input
          defaultValue="7K4P9"
          className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-login-input-border bg-login-input-bg px-4 py-[14px] font-display text-[18px] font-bold tracking-[3px] text-ink outline-none"
        />

        <div className="mb-2 text-[12px] font-bold tracking-[.7px] text-login-label">
          EMAIL
        </div>
        <input
          type="email"
          defaultValue="lucia.fernandez@gmail.com"
          className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-login-input-border bg-login-input-bg px-4 py-[14px] text-[15px] text-ink outline-none"
        />

        <div className="mb-2 text-[12px] font-bold tracking-[.7px] text-login-label">
          CREAR CONTRASEÑA
        </div>
        <input
          type="password"
          defaultValue="contraseña"
          className="mb-[18px] w-full rounded-[14px] border-[1.5px] bg-login-input-bg px-4 py-[14px] text-[15px] text-ink outline-none"
          style={{ borderColor: "#F2A78E" }}
        />

        <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-[14px] bg-checkbox-bg px-4 py-[14px]">
          <span className="mt-[1px] flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-checkbox-check">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="text-sm leading-[1.45] text-checkbox-text">
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de
            la app.
          </span>
        </label>

        <a
          href="#"
          className="block w-full rounded-[15px] bg-gradient-to-b from-coral-gradient to-coral-deep px-4 py-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
        >
          Activar mi cuenta
        </a>

        <p className="mt-[22px] mb-0 text-center text-[14.5px] text-login-subtext">
          ¿Ya tenés cuenta?{" "}
          <Link href="/auth/login" className="font-extrabold text-coral-dark">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
