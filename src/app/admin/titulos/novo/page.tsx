import { TitleForm } from "@/components/TitleForm";

export default function NewTitlePage() {
  return (
    <main className="px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl">Novo título</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Use apenas URLs de vídeo licenciadas ou de demonstração autorizada.
      </p>
      <TitleForm />
    </main>
  );
}
