import Link from "next/link";
import { redirect } from "next/navigation";
import { sala } from "@/lib/feed-data";
import { LoginForm } from "@/components/login-form";
import { getCurrentUserProfile } from "@/utils/supabase/profiles";

export default async function LoginPage() {
  const { user } = await getCurrentUserProfile();

  if (user) {
    redirect("/");
  }
  return (
    <div className="grid min-h-screen grid-cols-[1.05fr_1fr] bg-login-bg">
      <div
        className="relative flex flex-col justify-between overflow-hidden px-[60px] py-14 text-white"
        style={{
          background: "linear-gradient(155deg,#F6A98E 0%,#F2937A 45%,#EC7E62 100%)",
        }}
      >
        <div
          className="absolute -right-[120px] -top-[140px] h-[420px] w-[420px] rounded-full"
          style={{ background: "rgba(255,255,255,.12)" }}
        />
        <div
          className="absolute -bottom-[110px] -left-[80px] h-[300px] w-[300px] rounded-full"
          style={{ background: "rgba(255,255,255,.10)" }}
        />

        <div className="relative flex items-center gap-[13px]">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-white/22">
            <svg
              width="26"
              height="26"
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
          <span className="font-display text-[21px] font-semibold tracking-[.5px]">
            {sala.brand.name}
          </span>
        </div>

        <div className="relative">
          <h1 className="m-0 mb-[18px] font-display text-[42px] font-semibold leading-[1.12]">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p className="m-0 max-w-[430px] text-[17px] leading-[1.6] text-white/92">
            Publicá momentos, gestioná las salas y mantené a las familias cerca,
            desde un solo lugar.
          </p>
        </div>

        <div className="relative text-sm text-white/90">🌿 Guardería Sala Soles</div>
      </div>

      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-[392px]">
          <h2 className="m-0 mb-[6px] font-display text-[30px] font-semibold text-ink">
            Iniciar sesión
          </h2>
          <p className="mb-7 mt-0 text-[15px] text-login-subtext">
            Ingresá para ver el día de hoy.
          </p>

          <LoginForm />

          <p className="mt-6 mb-0 text-center text-[14.5px] text-login-subtext">
            ¿Te invitó la guardería?{" "}
            <Link href="/auth/activar-cuenta" className="font-extrabold text-coral-dark">
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
