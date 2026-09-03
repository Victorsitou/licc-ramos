"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRamo, RamoInterface } from "../../../utils";
import PDFViewer from "@/app/components/PDFViewer";
import {
  getResourceByIndex,
  getFileURL,
  Resource,
} from "@/app/services/resources";

import Breadcrumb from "@/app/components/Breadcrumb";

export default function ExtraPage() {
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
            "EXTRA",
            parseInt(id as string) - 1,
          ),
        ]);

        setRamo(fetchedRamo);
        setResource(fetchedResource);

        if (fetchedResource) {
          const url = await getFileURL(fetchedResource.key);
          setResourceURL(url);
        }
      } catch (error) {
        console.error("Error cargando el recurso extra:", error);
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
            Cargando recurso extra...
          </p>
        </div>
      </div>
    );
  }

  if (typeof slug !== "string" || typeof id !== "string" || !ramo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-10 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20">
          <span className="text-3xl">⚠</span>
          <p className="text-red-500 dark:text-red-400 text-sm font-medium">
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
    <div className="flex flex-col gap-5 p-4">
      <div className="rounded-3xl border border-border bg-card p-6 text-left shadow-sm">
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

          <Breadcrumb
            items={[
              { label: ramo.sigla },
              { label: "Extras" },
              { label: resource?.title ?? `Extra ${id}` },
            ]}
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
              No hay un archivo disponible para este recurso extra.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
