"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import NavigationButton from "@/app/components/NavigationButton";
import Breadcrumb from "@/app/components/Breadcrumb";
import PDFViewer from "@/app/components/PDFViewer";

import { getRamo, RamoInterface } from "@/app/utils";
import { getResourceByIndex, Resource } from "@/app/services/resources";

export default function RamoClassPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params?.slug;
  const id = params?.id;

  const [ramo, setRamo] = useState<RamoInterface | null>(null);
  const [resource, setResource] = useState<Resource | null>(null);
  const [resourceURL, setResourceURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof slug !== "string" || typeof id !== "string") {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const [fetchedRamo, fetchedResource] = await Promise.all([
          getRamo(slug as string),
          getResourceByIndex(
            slug as string,
            "CLASS",
            parseInt(id as string) - 1,
          ),
        ]);

        setRamo(fetchedRamo);
        setResource(fetchedResource);

        if (fetchedResource) {
          setResourceURL(fetchedResource.url);
        }
      } catch (error) {
        console.error("Error cargando la clase:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-800 dark:border-t-zinc-300 animate-spin" />
          <p className="text-zinc-400 dark:text-zinc-500 text-sm tracking-wide">
            Cargando clase...
          </p>
        </div>
      </div>
    );
  }

  if (typeof slug !== "string" || typeof id !== "string" || !ramo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive bg-destructive-soft p-10">
          <span className="text-3xl">⚠</span>
          <p className="text-sm font-medium text-destructive">
            Ramo no encontrado
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-zinc-400 underline hover:text-zinc-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-border bg-card p-4 text-left shadow-sm">
        <div className="flex items-center gap-5 mb-5">
          <button
            onClick={() => router.push(`/${slug}/clases`)}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 text-xs font-medium tracking-wide uppercase transition-all duration-200 hover:gap-2.5 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver
          </button>

          <Breadcrumb
            items={[
              { label: ramo.sigla },
              { label: "Clases" },
              { label: `Clase ${id}` },
            ]}
          />
        </div>

        <div className="flex items-center justify-between gap-3 mb-5">
          <NavigationButton
            onClick={() => router.push(`/${slug}/clases/${parseInt(id) - 1}`)}
            label="Anterior"
            value={`Clase ${parseInt(id) - 1}`}
            direction="left"
            disabled={parseInt(id) <= 1}
            icon={
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />

          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {id} / {ramo.clases}
          </span>

          <NavigationButton
            onClick={() => router.push(`/${slug}/clases/${parseInt(id) + 1}`)}
            label="Siguiente"
            value={`Clase ${parseInt(id) + 1}`}
            direction="right"
            disabled={parseInt(id) >= ramo.clases}
            icon={
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>

        {resourceURL ? (
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border shadow-sm dark:shadow-black/40">
            <PDFViewer url={resourceURL} title={resource?.title} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-zinc-400 dark:text-zinc-600">
            <span className="text-4xl opacity-50">📄</span>
            <p className="text-sm">
              No hay recurso disponible para esta clase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
