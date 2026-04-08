"use client";

import type { RamoInterface } from "../page";
import { useEffect, useRef, useState } from "react";

import { Chip } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { formatDate, isToday } from "../utils";

export default function Ramo({
  ramo,
  onBack,
}: {
  ramo: RamoInterface;
  onBack: () => void;
}) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState<string>("");
  const [pdfDoc, setPdfDoc] = useState<
    import("pdfjs-dist").PDFDocumentProxy | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const latestInterrogacion = Math.max(
    0,
    ...ramo.info_clases.map((c) => c.interrogacion || 0),
  );

  // Ayudantía
  const [showAyudantia, setShowAyudantia] = useState(false);
  const [ayudantiaData, setAyudantiaData] = useState<
    | {
        url: string;
        title: string;
      }[]
    | null
  >(null);
  useEffect(() => {
    if (showAyudantia) {
      fetch(`/api/ayudantias`)
        .then((res) => res.json())
        .then((data) => {
          for (const item of data) {
            if (item.ramo === ramo.sigla) {
              const ayudantiasData = item.ayudantiasFiles.map(
                (file: { url: string; name: string }) => ({
                  url: file.url,
                  title: file.name.replace(/_/g, " ").replace(".pdf", ""),
                }),
              );
              setAyudantiaData(ayudantiasData);
              break;
            }
          }
        });
    }
  }, [showAyudantia]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = pdfUrl ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [pdfUrl]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Cargar PDF cuando cambia la URL
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

  const openPdf = (url: string, title: string) => {
    setPdfUrl(url);
    setPdfTitle(title);
  };

  return (
    <section className="w-full">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8">
          <button
            onClick={onBack}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:-translate-y-0.5 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Volver
          </button>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Repositorio del ramo
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {ramo.nombre} - {ramo.sigla}
            </h2>
          </div>
        </div>

        {/* ayudantía */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setShowAyudantia(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            <MenuBookIcon sx={{ fontSize: 18 }} />
            Ver ayudantías
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {ramo.info_clases.map((item) => (
            <button
              type="button"
              key={item.clase}
              onClick={() =>
                openPdf(
                  `/${ramo.sigla}/Clases/Clase${item.clase}.pdf`,
                  `Clase ${item.clase}`,
                )
              }
              className={`group cursor-pointer rounded-3xl border border-zinc-200 p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl dark:border-zinc-800 ${
                isToday(item.fecha)
                  ? "ring-2 ring-blue-400 bg-blue-100 dark:bg-blue-900/30"
                  : "bg-zinc-50 dark:bg-zinc-950/40"
              }`}
            >
              <h3 className="text-xl font-bold leading-tight">
                Clase {item.clase} -{" "}
                {isToday(item.fecha) ? "Hoy" : formatDate(item.fecha)}
              </h3>

              {item.interrogacion && (
                <Chip
                  className="mt-2 font-bold"
                  label={`Interrogación ${item.interrogacion} (i${item.interrogacion})`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor:
                      latestInterrogacion === item.interrogacion
                        ? "red"
                        : "green",
                    color:
                      latestInterrogacion === item.interrogacion
                        ? "red"
                        : "green",
                  }}
                />
              )}

              {item.texto_guia && (
                <div className="mt-3">
                  <Chip
                    icon={<MenuBookIcon />}
                    label={item.texto_guia}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </div>
              )}

              <p className="mt-4 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                {item.contenido}
              </p>

              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Objetivo:
                </span>{" "}
                {item.objetivo}
              </p>
            </button>
          ))}
        </div>
      </div>

      {showAyudantia && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowAyudantia(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className="relative z-10 flex flex-col w-full sm:max-w-5xl sm:rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 h-[95dvh] sm:h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                  {ramo.sigla}
                </p>
                <h3 className="text-lg font-bold">Ayudantías disponibles</h3>
              </div>

              <button
                onClick={() => setShowAyudantia(false)}
                className="p-2 rounded-xl border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50 dark:bg-zinc-950/40">
              {!ayudantiaData ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin h-8 w-8 border-2 border-zinc-300 border-t-blue-500 rounded-full" />
                </div>
              ) : ayudantiaData.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center">
                  No hay ayudantías disponibles
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {ayudantiaData.map((item, i) => (
                    <button
                      key={item.url}
                      onClick={() => {
                        openPdf(item.url, item.title);
                        setShowAyudantia(false);
                      }}
                      className="group text-left rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 transition dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <h4 className="font-bold text-lg">Ayudantía {i + 1}</h4>

                      <p className="text-sm text-zinc-500 mt-2">{item.title}</p>

                      <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                        Ver material →
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar PDF */}
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
                  {pdfTitle}
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
                <canvas ref={canvasRef} className="w-full shadow-lg" />
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
    </section>
  );
}
