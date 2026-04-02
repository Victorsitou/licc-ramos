"use client";

import type { InfoClase, RamoInterface } from "../page";
import { useEffect, useRef, useState } from "react";
import { stringToDate } from "../utils";

import { Chip } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function findClasesHoy(ramo: RamoInterface): InfoClase | null {
  const hoy = new Date();
  for (const clase of ramo.info_clases) {
    if (stringToDate(clase.fecha).toDateString() === hoy.toDateString()) {
      return clase;
    }
  }
  return null;
}

export default function ClasesHoy({ ramo }: { ramo: RamoInterface }) {
  const claseHoy = findClasesHoy(ramo);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<
    import("pdfjs-dist").PDFDocumentProxy | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = pdfUrl ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [pdfUrl]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!pdfUrl) return;
    setLoading(true);
    setCurrentPage(1);
    setPdfDoc(null);

    import("pdfjs-dist").then((pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      pdfjsLib.getDocument(pdfUrl).promise.then((doc) => {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setLoading(false);
      });
    });
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    setTimeout(() => {
      pdfDoc.getPage(currentPage).then((page) => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        const containerWidth = containerRef.current!.clientWidth;
        const dpr = window.devicePixelRatio || 1;

        const viewport = page.getViewport({ scale: 1 });
        const scale = (containerWidth / viewport.width) * dpr;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = containerWidth + "px";
        canvas.style.height = scaledViewport.height / dpr + "px";

        page.render({
          canvasContext: context,
          viewport: scaledViewport,
        } as any);
      });
    }, 50);
  }, [pdfDoc, currentPage]);

  const closeModal = () => {
    setPdfUrl(null);
    setPdfDoc(null);
    setCurrentPage(1);
  };

  if (!claseHoy) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No hay clases programadas para hoy.
      </p>
    );
  }

  const pdfPath = `/${ramo.sigla}/Clases/Clase${claseHoy.clase}.pdf`;

  return (
    <>
      <button
        type="button"
        onClick={() => setPdfUrl(pdfPath)}
        className="group w-full cursor-pointer rounded-3xl border border-zinc-200 bg-blue-100 p-5 text-left shadow-sm ring-2 ring-blue-400 transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl dark:border-zinc-800 dark:bg-blue-900/30"
      >
        <h3 className="text-xl font-bold leading-tight">
          Clase {claseHoy.clase} - Hoy
        </h3>

        {claseHoy.texto_guia && (
          <div className="mt-3">
            <Chip
              icon={<MenuBookIcon />}
              label={claseHoy.texto_guia}
              size="small"
              color="primary"
              variant="outlined"
            />
          </div>
        )}

        <p className="mt-4 text-base font-semibold text-zinc-800 dark:text-zinc-100">
          {claseHoy.contenido}
        </p>

        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Objetivo:
          </span>{" "}
          {claseHoy.objetivo}
        </p>
      </button>

      {/* MODAL */}
      {pdfUrl && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className="relative z-10 flex flex-col w-full sm:max-w-5xl sm:rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 h-[95dvh] sm:h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
                  {ramo.sigla}
                </p>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  Clase {claseHoy.clase} - Hoy
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
                >
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                  <span className="hidden sm:inline">Abrir en pestaña</span>
                </a>
                <button
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 p-2 text-zinc-600 transition hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  aria-label="Cerrar"
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </button>
              </div>
            </div>

            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center"
            >
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-300 border-t-blue-500" />
                </div>
              ) : (
                <canvas ref={canvasRef} className="shadow-lg" />
              )}
            </div>

            {!loading && totalPages > 0 && (
              <div className="flex items-center justify-center gap-4 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 disabled:opacity-30 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition"
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
                </button>

                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 disabled:opacity-30 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition"
                >
                  <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
