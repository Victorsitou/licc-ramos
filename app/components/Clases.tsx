"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Chip } from "@mui/material";
import Button from "./Button";
import clsx from "clsx";
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
    const sorted = ramo.info_clases.sort(
      (a, b) =>
        +new Date(a.fecha + "T00:00:00") - +new Date(b.fecha + "T00:00:00"),
    );

    const nextIndex = sorted.findIndex(
      (c) => new Date(c.fecha + "T00:00:00") >= today,
    );

    if (nextIndex === -1) return undefined;

    const targetIndex = nextIndex - ramo.offset;
    return sorted[Math.max(targetIndex, 0)];
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
      <div className="relative rounded-2xl border border-border bg-card p-4 overflow-hidden">
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">
              Filtrar por:
            </span>

            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-sm transition
            ${
              filter === f
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
              <span className="text-sm text-muted-foreground">
                Ordenar por:
              </span>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                className="bg-muted text-foreground text-sm rounded-xl px-3 py-1.5 border-none outline-none cursor-pointer"
              >
                <option value="asc">{"Fecha (antiguas -> nuevas)"}</option>
                <option value="desc">{"Fecha (nuevas -> antiguas)"}</option>
              </select>
            </div>

            <Button
              onClick={() => {
                if (nextRef.current) {
                  nextRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  onScrollToNext();
                }
              }}
              rounded="lg"
            >
              Próxima clase →
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(() => {
          const todayClass = filtered.find((c) => isToday(c.fecha));
          const highlightedClassNumber = todayClass
            ? todayClass.clase - ramo.offset
            : nextClase?.clase;
          const todayLabelClassNumber = todayClass
            ? Math.max(todayClass.clase - ramo.offset, 1)
            : undefined;
          const nextInterrogacion = ramo.info_interrogaciones.find((i) => {
            const fecha = new Date(i.fecha);
            fecha.setDate(fecha.getDate() + 1);
            return fecha >= new Date();
          });

          return filtered.map((item, i) => {
            const isNext = item.clase === nextClase?.clase;
            const isHighlighted = item.clase === highlightedClassNumber;
            const shouldPulse = isNext && highlight;
            const showsTodayLabel = item.clase === todayLabelClassNumber;
            const isNextInterrogacion =
              nextInterrogacion?.interrogacion === item.interrogacion;

            return (
              <button
                key={item.clase}
                ref={isNext ? nextRef : null}
                className={clsx(
                  "group rounded-3xl border border-border bg-card p-5 text-left shadow-sm transition duration-200",

                  "hover:-translate-y-1 hover:border-accent hover:shadow-xl",

                  {
                    "ring-2 ring-ring bg-highlight": isHighlighted,

                    "scale-[1.03]": shouldPulse,
                  },
                )}
                onClick={() =>
                  router.push(`${ramo.sigla}/clases/${item.clase}`)
                }
              >
                <h3 className="text-xl font-bold leading-tight">
                  Clase {item.clase} -{" "}
                  {showsTodayLabel ? "Hoy" : formatDate(item.fecha)}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  {item.interrogacion && (
                    <Chip
                      className="font-bold"
                      label={`Interrogación ${item.interrogacion}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: isNextInterrogacion ? "red" : "green",

                        color: isNextInterrogacion ? "red" : "green",
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

                <p className="mt-4 text-base font-bold text-foreground">
                  {item.contenido}
                </p>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Objetivo:
                  </span>{" "}
                  {item.objetivo}
                </p>

                {isNext && (
                  <div className="mt-3 text-xs font-bold text-primary">
                    PRÓXIMA CLASE
                  </div>
                )}
              </button>
            );
          });
        })()}
      </div>
    </div>
  );
}
