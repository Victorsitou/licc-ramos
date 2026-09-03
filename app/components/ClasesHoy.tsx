"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { InfoClase, RamoInterface } from "@/app/utils";
import { stringToDate } from "../utils";
import { fillClasses } from "../services/resources";

import { Chip } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import clsx from "clsx";

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
  const router = useRouter();
  const claseRealHoy = findClasesHoy(ramo);
  const claseHoy = claseRealHoy
    ? (ramo.info_clases.find(
        (c) => c.clase === Math.max(claseRealHoy.clase - ramo.offset, 1),
      ) ?? null)
    : null;

  useEffect(() => {
    if (!ramo.metadata?.has_classes) {
      fillClasses(ramo).then((updatedRamo) => {
        if (updatedRamo) {
          router.refresh();
        }
      });
    }
  }, [ramo, router]);

  if (!claseHoy) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay clases programadas para hoy.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (ramo.metadata?.has_pdf) {
          router.push(`/${ramo.sigla}/clases/${claseHoy.clase}`);
        }
      }}
      className={clsx(
        "group w-full rounded-3xl border border-border bg-card p-5 text-left shadow-sm transition duration-200",
        "hover:-translate-y-1 hover:border-accent hover:shadow-xl",
        "ring-2 ring-ring bg-highlight cursor-pointer",
      )}
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

      <p className="mt-4 text-base font-semibold text-foreground">
        {claseHoy.contenido}
      </p>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        <span className="font-semibold text-foreground">Objetivo:</span>{" "}
        {claseHoy.objetivo}
      </p>
    </button>
  );
}
