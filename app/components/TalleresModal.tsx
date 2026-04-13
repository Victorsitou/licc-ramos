import { useEffect, useState } from "react";
import PdfViewer from "./PDFViewer";

import CloseIcon from "@mui/icons-material/Close";

export default function TalleresModal({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const [pdfData, setPdfData] = useState<{ url: string; title: string } | null>(
    null,
  );
  const [talleresData, setTalleresData] = useState<
    | {
        url: string;
        name: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    if (open) {
      fetch("/api/talleres")
        .then((response) => response.json())
        .then((data) => setTalleresData(data));
    }
  }, [open]);

  return (
    <div>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={() => close()}
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
                ...
              </p>
              <h3 className="text-lg font-bold">Talleres disponibles</h3>
            </div>

            <button
              onClick={() => close()}
              className="p-2 rounded-xl border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="flex-1 overflow-y-auto p-6 bg-zinc-50 dark:bg-zinc-950/40">
            {!talleresData ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin h-8 w-8 border-2 border-zinc-300 border-t-blue-500 rounded-full" />
              </div>
            ) : talleresData.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center">
                No hay talleres disponibles
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {talleresData.map((item, i) => (
                  <button
                    key={item.url}
                    onClick={() => {
                      setPdfData({ url: item.url, title: item.name });
                    }}
                    className="group text-left rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 transition dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <h4 className="font-bold text-lg">Taller {i + 1}</h4>

                    <p className="text-sm text-zinc-500 mt-2">{item.name}</p>

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

      {pdfData && (
        <PdfViewer
          url={pdfData.url}
          title={pdfData.title}
          onClose={() => setPdfData(null)}
        />
      )}
    </div>
  );
}
