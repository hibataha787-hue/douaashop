"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCF8F9] p-6">
      <section className="max-w-lg rounded-3xl border border-[#F5D5DC] bg-white p-8 text-center shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-[#5C1429]">
          Impossible de charger cette page
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          {error.message || "Une erreur inattendue est survenue. Réessayez dans un instant."}
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-gray-400">Référence : {error.digest}</p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-[#5C1429] px-5 py-3 text-sm font-semibold text-white hover:bg-[#480F20]"
        >
          Réessayer
        </button>
      </section>
    </main>
  );
}
