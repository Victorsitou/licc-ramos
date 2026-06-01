"use client";
import { useRouter } from "next/navigation";

import MainLayout from "../components/layout/MainLayout";
import Footer from "../components/Footer";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { getUser, User } from "../utils";
import { useEffect, useState } from "react";


const sections = [
  {
    title: "Sets",
    description:
      "Practica por unidades con ejercicios ordenados progresivamente.",
    href: "/clearn/sets",
    icon: <AssignmentIcon fontSize="small" />,
    badge: "Problemas guiados",
  },
  {
    title: "Compilados",
    description:
      "Colecciones grandes de ejercicios mezclados para entrenamiento.",
    href: "/clearn/compilados",
    icon: <FolderCopyIcon fontSize="small" />,
    badge: "Entrenamiento",
  },
  {
    title: "Interrogaciones",
    description:
      "Ensayos e interrogaciones anteriores para medir tu nivel.",
    href: "/clearn/interrogaciones",
    icon: <QuizIcon fontSize="small" />,
    badge: "Evaluaciones",
  },
  {
    title: "Actividades",
    description:
      "Actividades complementarias y material extra del curso.",
    href: "/clearn/actividades",
    icon: <FactCheckIcon fontSize="small" />,
    badge: "Extra",
  },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
      getUser().then(setUser);
    }, []);

  return (
    <MainLayout
      title="Repositorio LICC"
      subtitle="Accede rápido a clases, ejercicios y evaluaciones."
      badge="MAT UC"
    >
      <div className="transition-colors">
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">

          
          <section className="mb-10 rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <AutoAwesomeIcon fontSize="inherit" />
                  Seguimiento de progreso
                </div>

                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Introducción a la programación
                </h1>

                <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                  Accede a problemas, interrogaciones, compilados y material
                  del curso desde un solo lugar.
                </p>
              </div>

        
            </div>
          </section>

          <section className="w-full">
            <div className="mb-5 flex items-center gap-2 text-primary">
              <MenuBookIcon fontSize="small" />

              <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
                Contenido
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {sections.map((section) => (
                <div
                  key={section.title}
                  onClick={() => router.push(section.href)}
                  className="group cursor-pointer rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {section.badge}
                      </div>

                      <h3 className="text-2xl font-black tracking-tight">
                        {section.title}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-muted p-3 text-muted-foreground transition-transform group-hover:scale-105">
                      {section.icon}
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    {section.description}
                  </p>

                  <div className="mt-7">
                    <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 cursor-pointer">
                      Entrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-auto pt-14">
            <Footer />
          </div>
        </main>
      </div>
    </MainLayout>
  );
}