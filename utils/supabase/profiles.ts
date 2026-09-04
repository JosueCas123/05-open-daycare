import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type UserRole = "staff" | "parent" | "admin";

export type Profile = {
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
};

export type CurrentProfile = {
  fullName: string;
  role: UserRole | null;
  avatarLetter: string;
};

export async function getCurrentUserProfile(): Promise<{
  user: User | null;
  profile: Profile | null;
}> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data } = await supabase
    .from("users")
    .select("full_name, role, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (data as Profile | null) ?? null };
}

export async function requireUser(): Promise<CurrentProfile> {
  const { user, profile } = await getCurrentUserProfile();

  if (!user) {
    redirect("/auth/login");
  }

  const fallbackName = (user.email ?? "").split("@")[0] || "Usuario";
  const fullName = profile?.full_name || fallbackName;
  const avatarLetter = (fullName.trim().charAt(0) || "?").toUpperCase();

  return {
    fullName,
    role: profile?.role ?? null,
    avatarLetter,
  };
}