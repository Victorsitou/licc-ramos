"use client";

import { useEffect, useRef, useState } from "react";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

type Props = {
  url: string;
  title?: string;
};

export default function PdfViewer({ url, title }: Props) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    const checkSize = () => {
      setIsCompact(window.innerHeight < 500);
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    let renderTask: any = null;

    pdfDoc.getPage(currentPage).then((page: any) => {
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d")!;
      const container = containerRef.current!;
      const containerWidth = container.clientWidth;

      const dpr = window.devicePixelRatio || 1;

      const viewport = page.getViewport({ scale: 1 });

      const scaleX = containerWidth / viewport.width;

      const scale = scaleX * dpr;

      const scaledViewport = page.getViewport({ scale });

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      canvas.style.width = scaledViewport.width / dpr + "px";
      canvas.style.height = scaledViewport.height / dpr + "px";

      renderTask = page.render({
        canvasContext: context,
        viewport: scaledViewport,
      });
      renderTask.promise.catch((err: any) => {
        if (err?.name !== "RenderingCancelledException") console.error(err);
      });
    });

    return () => {
      renderTask?.cancel();
    };
  }, [pdfDoc, currentPage, isFullscreen]);

  useEffect(() => {
    if (!pdfDoc) return;
    const timeout = setTimeout(() => {
      setPdfDoc((d: any) => d); // trigger re-render
    }, 50);
    return () => clearTimeout(timeout);
  }, [isFullscreen]);

  const downloadPDF = () => {
    fetch(url).then(async (res) => {
      if (!res.body) return;
      const buffer = await res.arrayBuffer();
      const blob = new Blob([buffer], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = (title || "document") + ".pdf";
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  };

  const viewer = (
    <div
      className={`relative flex flex-col w-full bg-white dark:bg-zinc-900 ${
        isFullscreen ? "h-full" : "rounded-3xl overflow-hidden shadow-2xl"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0 ${
          isCompact ? "px-3 py-2" : "px-5 py-4"
        }`}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Documento
          </p>
          <h3 className="text-base font-bold truncate">{title}</h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <DownloadIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline">Descargar</span>
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ContentCopyIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline">Copiar enlace</span>
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
            <span>Abrir en pestaña</span>
          </a>

          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
            title={
              isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
            }
          >
            {isFullscreen ? (
              <FullscreenExitIcon sx={{ fontSize: 20 }} />
            ) : (
              <FullscreenIcon sx={{ fontSize: 20 }} />
            )}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center ${isFullscreen ? "flex-1 overflow-y-auto" : "min-h-[200px]"}`}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-300 border-t-zinc-800 dark:border-t-zinc-300" />
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full shadow-lg" />
        )}
      </div>

      {!loading &&
        totalPages > 0 &&
        (isCompact ? (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-full bg-white/20 text-white disabled:opacity-30"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
            </button>

            <span className="text-xs font-semibold text-white tabular-nums">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-full bg-white/20 text-white disabled:opacity-30"
            >
              <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 disabled:opacity-30 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </button>

            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums">
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
        ))}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col">
        {viewer}
      </div>
    );
  }

  return viewer;
}
