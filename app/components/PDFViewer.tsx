"use client";

import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import ButtonLink from "./ButtonLink";
import IconButton from "./IconButton";

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
      className={`relative flex flex-col w-full bg-card ${
        isFullscreen ? "h-full" : "rounded-3xl overflow-hidden shadow-2xl"
      }`}
    >
      <div
        className={`flex flex-col gap-4 border-b border-border shrink-0 md:flex-row md:items-center md:justify-between ${
          isCompact ? "px-3 py-2" : "px-5 py-4"
        }`}
      >
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Documento
          </p>
          <h3 className="text-base font-bold truncate">{title}</h3>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0 items-center justify-center">
          <Button
            onClick={downloadPDF}
            variant="surface"
            className="inline-flex items-center gap-1.5"
            rounded="lg"
          >
            <DownloadIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline">Descargar</span>
          </Button>

          <Button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            variant="surface"
            className="inline-flex items-center gap-1.5"
            rounded="lg"
          >
            <ContentCopyIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline">Copiar enlace</span>
          </Button>

          <ButtonLink
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            variant="surface"
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline">Abrir en pestaña</span>
          </ButtonLink>

          <Button
            onClick={() => setIsFullscreen((f) => !f)}
            variant="surface"
            className="inline-flex items-center gap-1.5"
            rounded="lg"
            title={
              isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
            }
          >
            {isFullscreen ? (
              <FullscreenExitIcon sx={{ fontSize: 18 }} />
            ) : (
              <FullscreenIcon sx={{ fontSize: 18 }} />
            )}
          </Button>
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
            <IconButton
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
            </IconButton>
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
            <IconButton
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
            </IconButton>

            <span className="text-sm font-semibold text-muted-foreground dark:text-zinc-300 tabular-nums">
              {currentPage} / {totalPages}
            </span>

            <IconButton
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </div>
        ))}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-card flex flex-col">{viewer}</div>
    );
  }

  return viewer;
}
