import type { InfoClase, RamoInterface } from "../page";
import { stringToDate } from "../utils";

import { Chip } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

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
  const claseHoy = findClasesHoy(ramo);

  if (!claseHoy) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No hay clases programadas para hoy.
      </p>
    );
  }

  return (
    <a
      href={`${ramo.url}Clase${claseHoy.clase}.pdf`}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-3xl border border-zinc-200 bg-blue-100 p-5 text-left shadow-sm ring-2 ring-blue-400 transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl dark:border-zinc-800 dark:bg-blue-900/30"
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

      <p className="mt-4 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        {claseHoy.contenido}
      </p>

      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          Objetivo:
        </span>{" "}
        {claseHoy.objetivo}
      </p>
    </a>
  );
}
