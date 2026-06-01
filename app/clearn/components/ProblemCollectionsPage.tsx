"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "@/app/components/layout/MainLayout";
import Footer from "@/app/components/Footer";

import {
  getProblemCollectionsByType,
  ProblemCollection,
  ProblemCollectionType,
} from "@/app/services/problem-collections";

interface ProblemCollectionsPageProps {
  type: ProblemCollectionType;
  title: string;
  subtitle: string;
  badge: string;
  sectionTitle: string;
  cardLabel: string;
  ctaLabel: string;
  icon: ReactNode;
  basePath: string;
}

export default function ProblemCollectionsPage({
  type,
  title,
  subtitle,
  badge,
  sectionTitle,
  cardLabel,
  ctaLabel,
  icon,
  basePath,
}: ProblemCollectionsPageProps) {
  const router = useRouter();

  const [collections, setCollections] = useState<ProblemCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const data = await getProblemCollectionsByType(type);
        setCollections(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar los contenidos.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [type]);

  return (
    <MainLayout title={title} subtitle={subtitle} badge={badge}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <section className="mb-8">
          <div className="flex items-center gap-2 text-primary">
            {icon}

            <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
              {sectionTitle}
            </h2>
          </div>
        </section>

        {loading ? (
          <div className="text-muted-foreground">Cargando contenido...</div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive-soft p-6 text-sm text-destructive">
            {error}
          </div>
        ) : collections.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No hay contenidos disponibles por ahora.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => router.push(`${basePath}/${collection.id}`)}
                className="group cursor-pointer rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {cardLabel} #{collection.orderIndex}
                    </div>

                    <h3 className="text-2xl font-black tracking-tight">
                      {collection.title}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-muted p-3 text-muted-foreground transition-transform group-hover:scale-105">
                    {icon}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  {collection.description || "Sin descripcion"}
                </p>

                <div className="mt-7">
                  <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 cursor-pointer">
                    {ctaLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-14">
          <Footer />
        </div>
      </main>
    </MainLayout>
  );
}
