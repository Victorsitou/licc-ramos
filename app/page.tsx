"use client";

import { useState } from "react";

import Footer from "./components/Footer";
import Ramo from "./components/Ramo";
import Card from "@mui/material/Card";

export interface RamoInterface {
  sigla: string;
  nombre: string;
  clases: number;
  url: string;
}

const RAMOS = [
  {
    sigla: "MAT1207",
    nombre: "Introducción a Algebra y Geometría",
    clases: 43,
    url: "https://repositorios.mat.uc.cl/MAT1207/",
  },
  {
    sigla: "MAT1107",
    nombre: "Introducción a Cálculo",
    clases: 29,
    url: "https://repositorios.mat.uc.cl/MAT1107/",
  },
];

export default function Home() {
  const [ramoSeleccionado, setRamoSeleccionado] =
    useState<RamoInterface | null>(null);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-16 px-16 sm:items-start">
        <h1 className="text-4xl font-bold mb-8 text-center text-black">
          ¡Busca las diapositivas más rápido aquí!
        </h1>
        <div className="w-full">
          {ramoSeleccionado ? (
            <Ramo
              {...ramoSeleccionado}
              onBack={() => setRamoSeleccionado(null)}
            />
          ) : (
            RAMOS.map((ramo) => (
              <Card
                key={ramo.sigla}
                className="rounded-lg p-4 mb-4"
                onClick={() => setRamoSeleccionado(ramo)}
                sx={{
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <h2 className="text-2xl font-semibold mb-2">
                  {ramo.nombre} - {ramo.sigla}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Clases disponibles: {ramo.clases}
                </p>
              </Card>
            ))
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}
