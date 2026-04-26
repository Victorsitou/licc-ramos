"use client";

import { useEffect, useRef, useState } from "react";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Props = {
  url: string;
  title?: string;
};

export default function PdfViewer({ url, title }: Props) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

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
      const containerWidth = containerRef.current!.clientWidth;
      const dpr = window.devicePixelRatio || 1;

      const viewport = page.getViewport({ scale: 1 });
      const scale = (containerWidth / viewport.width) * dpr;
      const scaledViewport = page.getViewport({ scale });

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      canvas.style.width = containerWidth + "px";
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
  }, [pdfDoc, currentPage]);

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

  return (
    <div className="flex flex-col w-full rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Documento
          </p>
          <h3 className="text-base font-bold">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            <DownloadIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline">Descargar</span>
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            <ContentCopyIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline">Copiar enlace</span>
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline">Abrir en pestaña</span>
          </a>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-zinc-100 flex flex-col items-center min-h-[200px]"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-300 border-t-blue-500" />
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full shadow-lg" />
        )}
      </div>

      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-center gap-4 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
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
  );
}
