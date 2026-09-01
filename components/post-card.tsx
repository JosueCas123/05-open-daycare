import type { Post, PostType } from "@/lib/feed-data";

interface BadgeStyle {
  label: string;
  bg: string;
  fg: string;
}

const BADGES: Record<PostType, BadgeStyle> = {
  logro: { label: "LOGRO", bg: "bg-logro-bg", fg: "text-logro-text" },
  actividad: {
    label: "ACTIVIDAD",
    bg: "bg-actividad-bg",
    fg: "text-actividad-text",
  },
  anuncio: { label: "ANUNCIO", bg: "bg-anuncio-bg", fg: "text-anuncio-text" },
};

export function PostCard({ post }: { post: Post }) {
  const badge = BADGES[post.type];

  return (
    <article className="rounded-[20px] border border-line bg-card px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <div className="mb-[14px] flex items-center gap-3">
        {post.avatar.kind === "letter" ? (
          <div
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full font-display text-[17px] font-semibold"
            style={{ background: post.avatar.bg, color: post.avatar.color }}
          >
            {post.avatar.letter}
          </div>
        ) : (
          <div
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full"
            style={{ background: post.avatar.bg, color: post.avatar.color }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <div className="font-display text-[16.5px] font-semibold text-ink">
            {post.authorName}
          </div>
          <div className="text-[12.5px] text-muted">{post.publishedAt}</div>
        </div>
        <div
          className={`flex items-center gap-[7px] rounded-full px-3 py-1.5 ${badge.bg} ${badge.fg}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          <span className="text-xs font-extrabold tracking-[.5px]">
            {badge.label}
          </span>
        </div>
      </div>

      <div className="mb-2.5 text-[12.5px] text-muted">{post.audience}</div>

      <p className="m-0 text-[15.5px] leading-[1.55] text-body">
        {post.text}
      </p>

      {post.photo && (
        <a
          href="#"
          className="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-photo-border bg-photo-bg text-muted-faint"
        >
          <svg
            width="30"
            height="30"
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
          <span className="text-[13.5px]">{post.photo.label}</span>
        </a>
      )}

      <div className="mt-4 flex items-center gap-[18px] border-t border-card-divider pt-[14px]">
        <span className="flex items-center gap-[7px] text-[14px] font-bold text-coral-text">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="#E0654A"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          {post.likes}
        </span>
        <a
          href="#"
          className="flex items-center gap-[7px] text-[14px] font-bold text-muted-strong"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
          </svg>
          {post.comments}
        </a>
        <span className="flex-1" />
        <a
          href="#"
          className="text-[14px] font-extrabold text-coral-dark"
        >
          Editar
        </a>
      </div>
    </article>
  );
}