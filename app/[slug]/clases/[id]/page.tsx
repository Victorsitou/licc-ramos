"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import PDFViewer from "@/app/components/PDFViewer";

import { getRamo } from "@/app/utils";
import { getResourceByIndex, Resource } from "@/app/services/resources";

export default function RamoClassPage() {
  const params = useParams();
  const router = useRouter();
  const { slug, id } = params;

  if (typeof slug !== "string" || typeof id !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-10 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20">
          <p className="text-red-500 dark:text-red-400 text-sm font-medium">
            Ramo no encontrado
          </p>
        </div>
      </div>
    );
  }

  const ramo = useMemo(() => getRamo(slug), [slug]);
  const [resource, setResource] = useState<Resource | null>(null);
  const [resourceURL, setResourceURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResourceByIndex(slug, "CLASS", parseInt(id) - 1).then((resource) => {
      setResource(resource);
      if (resource) setResourceURL(resource.url);
      setLoading(false);
    });
  }, []);

  if (!ramo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-10 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20">
          <span className="text-3xl">⚠</span>
          <p className="text-red-500 dark:text-red-400 text-sm font-medium">
            Ramo no encontrado
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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

          <nav className="flex items-center gap-1.5 text-xs tracking-widest uppercase">
            <span className="text-zinc-400 dark:text-zinc-600 font-medium">
              {slug}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">›</span>
            <span className="text-zinc-400 dark:text-zinc-600 font-medium">
              Clases
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">›</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
              Clase {id}
            </span>
          </nav>
        </div>

        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            onClick={() => router.push(`/${slug}/clases/${parseInt(id) - 1}`)}
            disabled={parseInt(id) <= 1}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="group-hover:-translate-x-0.5 transition-transform"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-left">
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-0.5">
                Anterior
              </p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Clase {parseInt(id) - 1}
              </p>
            </div>
          </button>

          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600 tabular-nums">
            {id} / {ramo.clases}
          </span>

          <button
            onClick={() => router.push(`/${slug}/clases/${parseInt(id) + 1}`)}
            disabled={parseInt(id) >= ramo.clases}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <div className="text-right">
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-0.5">
                Siguiente
              </p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Clase {parseInt(id) + 1}
              </p>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {resourceURL ? (
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-black/40">
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
