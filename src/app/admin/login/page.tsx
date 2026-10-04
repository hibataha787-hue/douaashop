"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("email");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error("Identifiant ou mot de passe incorrect.");
      }

      const { data: admin, error: adminError } = await supabase
        .from("admins")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        throw new Error(
          adminError
            ? `Vérification administrateur impossible : ${adminError.message}`
            : "Ce compte n'est pas autorisé à accéder à l'administration."
        );
      }

      router.push("/admin/dashboard");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Connexion impossible. Réessayez."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF1F3] via-white to-[#FCE8EB] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#F5D5DC] shadow-xl p-8 sm:p-10 space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          {/* Logo en médaillon identique au Header */}
          <Link
            href="/"
            className="inline-flex items-center justify-center group relative"
          >
            <div className="relative p-1 rounded-full bg-gradient-to-br from-[#FDF1F3] to-[#F7E1E6] border border-[#F5D0D7] shadow-sm group-hover:shadow-md transition-all duration-300">
              <Image
                src="/logo.jpeg"
                alt="Douaa Shop"
                width={150}
                height={60}
                priority
                className="w-auto h-10 sm:h-12 object-contain rounded-full group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5C1429]">
            Douaa Shop
          </h1>
          <p className="text-xs text-gray-500">
            Espace d&apos;Administration Sécurisé
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800">
              Identifiant Administrateur
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6] focus:outline-hidden focus:ring-2 focus:ring-[#5C1429]/20 focus:border-[#5C1429]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6] focus:outline-hidden focus:ring-2 focus:ring-[#5C1429]/20 focus:border-[#5C1429]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF0F2] text-[11px] text-[#7A1F39] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Connectez-vous avec le compte administrateur configuré dans Supabase.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#5C1429] hover:bg-[#480F20] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>{isLoading ? "Connexion..." : "Se connecter"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-[#5C1429] transition-colors"
          >
            ← Retourner à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}