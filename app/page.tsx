"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Footer from "./components/Footer";
import Ramo from "./components/Ramo";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import ramosJson from "./ramos.json";
const ramos = ramosJson as unknown as RamoInterface[];

export interface RamoInterface {
  sigla: string;
  nombre: string;
  clases: number;
  url: string;
  info_clases: {
    clase: number;
    objetivo: string;
    contenido: string;
    texto_guia?: string;
  }[];
}

export interface RamosData {
  [sigla: string]: RamoInterface;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        disabled
      >
        <LightModeIcon fontSize="small" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:scale-105 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <LightModeIcon fontSize="small" />
      ) : (
        <DarkModeIcon fontSize="small" />
      )}
    </button>
  );
}

export default function Home() {
  const [ramoSeleccionado, setRamoSeleccionado] =
    useState<RamoInterface | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-white text-zinc-900 transition-colors dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <AutoAwesomeIcon fontSize="small" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Repositorio de clases
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Busca tus diapositivas
            </h1>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              Accede a las diapositivas de los ramos MAT más rápido :)
            </p>
          </div>

          <ThemeToggle />
        </div>

        <div className="w-full">
          {ramoSeleccionado ? (
            <Ramo
              {...ramoSeleccionado}
              onBack={() => setRamoSeleccionado(null)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {ramos.map((ramo) => (
                <button
                  key={ramo.sigla}
                  onClick={() => setRamoSeleccionado(ramo)}
                  className="group rounded-3xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold leading-tight sm:text-2xl">
                        {ramo.nombre}
                      </h2>
                      <p className="mt-1 text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400">
                        {ramo.sigla}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-100 p-2 text-zinc-500 transition group-hover:scale-105 dark:bg-zinc-800 dark:text-zinc-300">
                      <MenuBookIcon fontSize="small" />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    Entra al repositorio del curso y abre las clases disponibles
                    de forma ordenada.
                  </p>

                  <div className="mt-5 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {ramo.clases} clases
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-10">
          <Footer />
        </div>
      </main>
    </div>
  );
}
