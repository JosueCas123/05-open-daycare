export type PostType = "logro" | "actividad" | "anuncio";

export type Avatar =
  | { kind: "letter"; letter: string; bg: string; color: string }
  | { kind: "icon"; bg: string; color: string };

export interface Post {
  id: string;
  type: PostType;
  authorName: string;
  avatar: Avatar;
  publishedAt: string;
  audience: string;
  text: string;
  photo?: { label: string };
  likes: number;
  comments: number;
}

export interface SalaInfo {
  nursery: string;
  greeting: string;
  summary: string;
  brand: { name: string; room: string };
}

export interface CurrentUser {
  name: string;
  role: string;
  avatar: string;
}

export const currentUser: CurrentUser = {
  name: "Caro Giménez",
  role: "Maestra · Soles",
  avatar: "C",
};

export const sala: SalaInfo = {
  nursery: "GUARDERÍA · SALA SOLES",
  greeting: "Buenas, Caro",
  summary: "12 niños · martes 17 jun",
  brand: { name: "OpenDayCare", room: "Sala Soles" },
};

export const posts: Post[] = [
  {
    id: "p1",
    type: "logro",
    authorName: "Mateo",
    avatar: { kind: "letter", letter: "M", bg: "#A9D9E8", color: "#1F7A93" },
    publishedAt: "14:20 · publicado por vos",
    audience: "Para: familia de Mateo",
    text: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "p2",
    type: "actividad",
    authorName: "Mateo",
    avatar: { kind: "letter", letter: "M", bg: "#A9D9E8", color: "#1F7A93" },
    publishedAt: "09:40 · publicado por vos",
    audience: "Para: familia de Mateo",
    text: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photo: { label: "Foto · pintando con témperas" },
    likes: 5,
    comments: 2,
  },
  {
    id: "p3",
    type: "anuncio",
    authorName: "Anuncio general",
    avatar: { kind: "icon", bg: "#CCD8F4", color: "#4E72C8" },
    publishedAt: "07:50 · publicado por vos",
    audience: "Para: toda la sala",
    text: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];