export type RoomId = "soles";

export interface ParentLink {
  id: string;
  name: string;
  relation: string;
  status: "activa" | "pendiente";
}

export interface Notes {
  title: string;
  body: string;
}

export interface Kid {
  id: string;
  name: string;
  ageInYears: number;
  room: RoomId;
  avatar: { letter: string; bg: string; color: string };
  allergy?: string;
  parentCount: string;
  parents: ParentLink[];
  birthDate: string;
  enrollment: string;
  notes: Notes;
}

export const roomName: Record<RoomId, string> = { soles: "Sala Soles" };

export const kids: Kid[] = [
  {
    id: "mateo-fernandez",
    name: "Mateo Fernández",
    ageInYears: 3,
    room: "soles",
    avatar: { letter: "M", bg: "#A9D9E8", color: "#1F7A93" },
    allergy: "MANÍ",
    parentCount: "2 padres vinculados",
    parents: [
      {
        id: "lucia-fernandez",
        name: "Lucía Fernández",
        relation: "Mamá · activa",
        status: "activa",
      },
      {
        id: "diego-fernandez",
        name: "Diego Fernández",
        relation: "Papá · invitación enviada",
        status: "pendiente",
      },
    ],
    birthDate: "12 mar 2022",
    enrollment: "feb 2025",
    notes: {
      title: "Alergias y notas",
      body: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    },
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    ageInYears: 2,
    room: "soles",
    avatar: { letter: "S", bg: "#F4B8CC", color: "#C44A7A" },
    parentCount: "1 padre vinculado",
    parents: [],
    birthDate: "8 jun 2023",
    enrollment: "mar 2025",
    notes: {
      title: "Notas",
      body: "Sin alergias registradas.",
    },
  },
  {
    id: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    ageInYears: 3,
    room: "soles",
    avatar: { letter: "B", bg: "#B9DEC4", color: "#3E8B62" },
    parentCount: "2 padres vinculados",
    parents: [],
    birthDate: "20 nov 2022",
    enrollment: "ene 2025",
    notes: {
      title: "Notas",
      body: "Sin alergias registradas.",
    },
  },
  {
    id: "valentina-soto",
    name: "Valentina Soto",
    ageInYears: 2,
    room: "soles",
    avatar: { letter: "V", bg: "#F4DC8E", color: "#9A7B1E" },
    allergy: "VINCULAR",
    parentCount: "sin padres vinculados",
    parents: [],
    birthDate: "5 abr 2023",
    enrollment: "feb 2025",
    notes: {
      title: "Notas",
      body: "Sin alergias registradas.",
    },
  },
  {
    id: "tomas-diaz",
    name: "Tomás Díaz",
    ageInYears: 3,
    room: "soles",
    avatar: { letter: "T", bg: "#C9B6E8", color: "#7B5FC0" },
    allergy: "LACTOSA",
    parentCount: "1 padre vinculado",
    parents: [],
    birthDate: "2 oct 2022",
    enrollment: "feb 2025",
    notes: {
      title: "Alergias y notas",
      body: "Intolerancia a la lactosa. Evitar lácteos.",
    },
  },
  {
    id: "emma-castro",
    name: "Emma Castro",
    ageInYears: 2,
    room: "soles",
    avatar: { letter: "E", bg: "#F4B8CC", color: "#C44A7A" },
    parentCount: "1 padre vinculado",
    parents: [],
    birthDate: "14 jul 2023",
    enrollment: "mar 2025",
    notes: {
      title: "Notas",
      body: "Sin alergias registradas.",
    },
  },
  {
    id: "lucas-romero",
    name: "Lucas Romero",
    ageInYears: 3,
    room: "soles",
    avatar: { letter: "L", bg: "#A9D9E8", color: "#1F7A93" },
    parentCount: "1 padre vinculado",
    parents: [],
    birthDate: "27 ene 2022",
    enrollment: "ene 2025",
    notes: {
      title: "Notas",
      body: "Sin alergias registradas.",
    },
  },
  {
    id: "olivia-vega",
    name: "Olivia Vega",
    ageInYears: 2,
    room: "soles",
    avatar: { letter: "O", bg: "#B9DEC4", color: "#3E8B62" },
    parentCount: "1 padre vinculado",
    parents: [],
    birthDate: "18 may 2023",
    enrollment: "feb 2025",
    notes: {
      title: "Notas",
      body: "Sin alergias registradas.",
    },
  },
];
