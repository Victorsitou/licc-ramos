"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { getRamo } from "../../../utils";
import PDFViewer from "@/app/components/PDFViewer";
import {
  getResourceByIndex,
  getFileURL,
  Resource,
} from "@/app/services/resources";

export default function AyudantiaPage() {
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
    getResourceByIndex(slug, "AYUDANTIA", parseInt(id) - 1).then((resource) => {
      setResource(resource);
      if (resource) getFileURL(resource.key).then(setResourceURL);
      setLoading(false);
    });
  }, [slug, id]);

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
            Cargando ayudantía...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-5 mb-5">
          <button
            onClick={() => router.back()}
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
              Ayudantías
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">›</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
              Ayudantía {id}
            </span>
          </nav>
        </div>

        {resourceURL ? (
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-black/40">
            <PDFViewer url={resourceURL} title={resource?.title} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-zinc-400 dark:text-zinc-600">
            <span className="text-4xl opacity-50">📄</span>
            <p className="text-sm">
              No hay recurso disponible para esta ayudantía.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
