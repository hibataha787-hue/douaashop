import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export class AdminAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthorizationError";
  }
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Vérification de la session impossible : ${authError.message}`);
  }
  if (!user) {
    throw new AdminAuthorizationError(
      "Veuillez vous connecter avec un compte administrateur."
    );
  }

  const { data: admin, error } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Vérification administrateur impossible : ${error.message}`);
  }

  if (!admin) {
    throw new AdminAuthorizationError(
      "Ce compte n'est pas autorisé à accéder à l'administration."
    );
  }

  return supabase;
}

export async function requireAdminPage() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      redirect("/admin/login");
    }
    throw error;
  }
}
