"use client";

import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getFileURL } from "../services/resources";
import type { Resource } from "../services/resources";

import PdfViewer from "./PDFViewer";

import LockIcon from "@mui/icons-material/Lock";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { User } from "../utils";
import { RamoInterface } from "../page";
import { toggleResourceCompletion, getResource } from "../services/resources";
import dayjs from "@lib/dayjs";

export default function AyudantiaModal({
  ramo,
  open,
  onClose,
  ramoSigla,
  user,
}: {
  ramo: RamoInterface;
  open: boolean;
  onClose: () => void;
  ramoSigla: string;
  user: User | null;
}) {
  const [ayudantiaData, setAyudantiaData] = useState<Resource[] | null>(null);
  const [pdfData, setPdfData] = useState<{ url: string; title: string } | null>(
    null,
  );

  const loadAyudantiaData = () => {
    getResource().then((data) => {
      setAyudantiaData(
        data.filter((r) => r.slug === ramo.sigla && r.type === "AYUDANTIA"),
      );
    });
  };

  const toggleCompleted = (resource: Resource) => {
    toggleResourceCompletion(resource.id, !resource.completed).then(() => {
      loadAyudantiaData();
    });
  };

  useEffect(() => {
    if (!open || ayudantiaData !== null) return;
    loadAyudantiaData();
  }, []);

  if (!open) return null;

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
              {ramoSigla}
            </p>
            <h3 className="text-lg font-bold">Ayudantías disponibles</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50 dark:bg-zinc-950/40">
          {!ayudantiaData ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin h-8 w-8 border-2 border-zinc-300 border-t-blue-500 rounded-full" />
            </div>
          ) : ayudantiaData.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6">
              {!user ? (
                <>
                  <div className="mb-4 text-zinc-400">
                    <LockIcon sx={{ fontSize: 48 }} />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                    Inicia sesión
                  </h3>
                  <p className="text-zinc-500 mt-2 max-w-sm">
                    Necesitas iniciar sesión para ver las ayudantías disponibles
                    y guardar tu progreso.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 text-zinc-400">
                    <MenuBookIcon sx={{ fontSize: 48 }} />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                    No hay ayudantías disponibles
                  </h3>
                  <p className="text-zinc-500 mt-2 max-w-sm">
                    Aún no se han publicado ayudantías, intenta nuevamente más
                    tarde.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {[...ayudantiaData].reverse().map((item, i) => (
                <div
                  key={item.key}
                  className={`group rounded-2xl border p-5 shadow-sm transition
                    ${
                      item.completed
                        ? "bg-green-50 border-green-400 dark:bg-green-900/20"
                        : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
                    }`}
                >
                  <button
                    onClick={() => {
                      getFileURL(item.key).then((url) => {
                        setPdfData({
                          url,
                          title: item.title.replace(/(\.dvi)?\.pdf$/i, ""),
                        });
                      });
                    }}
                    className="text-left w-full cursor-pointer"
                  >
                    <h4 className="font-bold text-lg">
                      Ayudantía {item.title.split(" ")[1]}
                    </h4>

                    <p className="text-sm text-zinc-500 mt-2">
                      {item.title}{" "}
                      {item.completed &&
                        ` (completado ${dayjs(item.completedAt).fromNow()})`}
                    </p>

                    <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                      Ver material →
                    </div>
                  </button>

                  {user && (
                    <button
                      onClick={() => toggleCompleted(item)}
                      className={`mt-4 w-full text-sm py-2 rounded-xl border transition cursor-pointer
                      ${
                        item.completed
                          ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                          : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:dark:bg-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {item.completed && (
                          <CheckCircleIcon sx={{ fontSize: 18 }} />
                        )}
                        <span>
                          {item.completed
                            ? "Marcada como completada"
                            : "Marcar como completada"}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {pdfData && (
        <PdfViewer
          title={pdfData.title}
          url={pdfData.url}
          onClose={() => setPdfData(null)}
        />
      )}
    </div>
  );
}
