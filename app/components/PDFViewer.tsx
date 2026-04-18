"use client";

import { useEffect, useRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Props = {
  url: string | null;
  title?: string;
  onClose: () => void;
};

export default function PdfViewer({ url, title, onClose }: Props) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // bloquear scroll
  useEffect(() => {
    document.body.style.overflow = url ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [url]);

  // escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // cargar PDF
  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setCurrentPage(1);
    setPdfDoc(null);

    import("pdfjs-dist").then((pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      pdfjsLib.getDocument(url).promise.then((doc: any) => {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setLoading(false);
      });
    });
  }, [url]);

  // render page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    pdfDoc.getPage(currentPage).then((page: any) => {
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
      });
    });
  }, [pdfDoc, currentPage]);

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 flex flex-col w-full sm:max-w-5xl sm:rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 h-[95dvh] sm:h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
              Documento
            </p>
            <h3 className="text-base font-bold">{title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
            >
              <OpenInNewIcon sx={{ fontSize: 16 }} />
              <span className="hidden sm:inline">Abrir en pestaña</span>
            </a>

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 p-2 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto bg-zinc-100 flex flex-col items-center"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-300 border-t-blue-500" />
            </div>
          ) : (
            <canvas ref={canvasRef} className="w-full shadow-lg" />
          )}
        </div>

        {/* NAV */}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 disabled:opacity-30 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition"
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
