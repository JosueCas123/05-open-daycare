import type { ReactNode } from "react";
import Link from "next/link";
import { sala } from "@/lib/feed-data";
import { CreatePostModal } from "@/components/create-post-modal";
import { logoutAction } from "@/app/auth/actions";
import type { UserRole } from "@/utils/supabase/profiles";

const ROLE_LABELS: Record<UserRole, string> = {
  staff: "Staff",
  parent: "Familiar",
  admin: "Admin",
};

interface NavItem {
  id: "feed" | "ninos" | "avisos" | "cuenta";
  label: string;
  href: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "feed",
    label: "Feed",
    href: "/",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    id: "ninos",
    label: "Niños",
    href: "/kids",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
      </svg>
    ),
  },
  {
    id: "avisos",
    label: "Avisos",
    href: "#",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),
  },
  {
    id: "cuenta",
    label: "Mi cuenta",
    href: "#",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

interface SidebarProps {
  active?: "feed" | "ninos";
  fullName: string;
  role: UserRole | null;
  avatarLetter: string;
}

export function Sidebar({
  active = "feed",
  fullName,
  role,
  avatarLetter,
}: SidebarProps) {
  const displayRole = role ? ROLE_LABELS[role] : null;
  return (
    <aside className="flex h-screen w-[248px] flex-none flex-col px-4 py-6 sticky top-0 bg-card border-r border-line">
      <a
        href="#"
        className="flex items-center gap-[11px] px-2 pb-[22px] pt-1"
      >
        <div
          className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(155deg,#F8C3A8,#F2937A)",
          }}
        >
          <svg
            width="21"
            height="21"
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
        <div>
          <div className="font-display text-[17px] font-semibold leading-none text-ink">
            {sala.brand.name}
          </div>
          <div className="mt-0.5 text-[11.5px] text-muted">
            {sala.brand.room}
          </div>
        </div>
      </a>

      <CreatePostModal
        trigger={
          <span className="flex w-full items-center justify-center gap-2">
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
          </span>
        }
      />

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-xl bg-coral-soft px-3 py-[11px] text-[14.5px] font-extrabold text-coral-accent"
                  : "flex items-center gap-3 rounded-xl bg-transparent px-3 py-[11px] text-[14.5px] font-semibold text-muted-nav"
              }
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-[10px] border-t border-line pt-[14px]">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-coral font-display text-base font-semibold text-white">
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold text-ink">
              {fullName}
            </div>
            {displayRole && (
              <div className="text-xs text-muted">{displayRole}</div>
            )}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-cream text-muted-strong"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}