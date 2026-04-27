"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Chip } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import { RamoInterface, isToday, formatDate } from "../utils";

export default function Clases({
  ramo,
  nextRef,
  highlight,
  onScrollToNext,
}: {
  ramo: RamoInterface;
  nextRef: React.RefObject<HTMLButtonElement | null>;
  highlight: boolean;
  onScrollToNext: () => void;
}) {
  const router = useRouter();

  const [filter, setFilter] = useState<string>("todas");
  const filterOptions = useMemo(() => {
    const options = new Set<string>(["todas"]);
    ramo.info_clases.forEach((c) => {
      if (c.interrogacion) {
        options.add(`i${c.interrogacion}`);
      }
    });
    options.add("sin");
    return Array.from(options);
  }, [ramo]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const nextClase = useMemo(() => {
    const today = new Date();
    return ramo.info_clases
      ?.filter((c) => new Date(c.fecha + "T00:00:00") >= today)
      ?.sort(
        (a, b) =>
          +new Date(a.fecha + "T00:00:00") - +new Date(b.fecha + "T00:00:00"),
      )[0];
  }, [ramo]);

  const filtered = useMemo(() => {
    let clases = [...ramo.info_clases];

    if (filter !== "todas") {
      if (filter === "sin") {
        clases = clases.filter((c) => !c.interrogacion);
      } else {
        clases = clases.filter((c) => `i${c.interrogacion}` === filter);
      }
    }

    clases.sort((a, b) => {
      const diff = +new Date(a.fecha) - +new Date(b.fecha);
      return order === "asc" ? diff : -diff;
    });

    return clases;
  }, [ramo, filter, order]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/60 via-transparent to-zinc-100/60 dark:from-zinc-800/40 dark:via-transparent dark:to-zinc-800/40 blur-xl pointer-events-none" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-400 mr-2">Filtrar por:</span>

            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-sm transition
            ${
              filter === f
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
              >
                {f === "todas"
                  ? "Todas"
                  : f === "sin"
                    ? "Sin interrogación"
                    : f.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Ordenar por:</span>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                className="bg-zinc-100 dark:bg-zinc-800 text-sm rounded-xl px-3 py-1.5 text-zinc-700 dark:text-zinc-200 border-none outline-none"
              >
                <option value="asc">{"Fecha (antiguas -> nuevas)"}</option>
                <option value="desc">{"Fecha (nuevas -> antiguas)"}</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (nextRef.current) {
                  nextRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  onScrollToNext();
                }
              }}
              className="w-full md:w-auto inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Próxima clase →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item, i) => {
          const previousIsToday =
            i === 0 ? false : isToday(filtered[i - 1]?.fecha);
          const today = isToday(item.fecha);
          const isNext = item.clase === nextClase?.clase;

          let css = "";
          if (today) {
            css = "ring-2 ring-blue-400 bg-blue-100 dark:bg-blue-900/30";
          } else if (isNext && !previousIsToday) {
            css = "ring-2 ring-blue-400 bg-blue-100 dark:bg-blue-900/30";
          }

          if (isNext && highlight) {
            css += "ring-2 ring-blue-400";
          }

          return (
            <button
              key={item.clase}
              ref={isNext ? nextRef : null}
              className={`group text-left rounded-3xl border border-zinc-200 p-5 shadow-sm transition duration-200
                hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl
                dark:border-zinc-800
                ${css ? css : "bg-zinc-50 dark:bg-zinc-950/40"}
                ${isNext && highlight ? "scale-[1.03]" : ""}
              `}
              onClick={() => router.push(`${ramo.sigla}/clases/${item.clase}`)}
            >
              <h3 className="text-xl font-bold leading-tight">
                Clase {item.clase} -{" "}
                {isToday(item.fecha) ? "Hoy" : formatDate(item.fecha)}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                {item.interrogacion && (
                  <Chip
                    className="font-bold"
                    label={`Interrogación ${item.interrogacion}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "green",
                      color: "green",
                    }}
                  />
                )}

                {item.texto_guia && (
                  <Chip
                    icon={<MenuBookIcon />}
                    label={item.texto_guia}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </div>

              <p className="mt-4 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                {item.contenido}
              </p>

              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Objetivo:
                </span>{" "}
                {item.objetivo}
              </p>

              {isNext && (
                <div className="mt-3 text-xs font-bold text-blue-500">
                  PRÓXIMA CLASE
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
