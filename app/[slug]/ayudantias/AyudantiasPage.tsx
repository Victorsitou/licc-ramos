"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getRamo, getUser, User } from "../../utils";
import {
  getResource,
  toggleResourceCompletion,
  Resource,
} from "@/app/services/resources";

import LockIcon from "@mui/icons-material/Lock";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import dayjs from "@lib/dayjs";

export default function AyudantiasPage({
  initialData,
}: {
  initialData: Resource[];
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  if (typeof slug !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-10 rounded-xl border border-red-900/40 bg-red-950/20">
          <p className="text-red-400 text-sm font-medium">Ramo no encontrado</p>
        </div>
      </div>
    );
  }
  const [ramo] = useState(getRamo(slug));

  const [user, setUser] = useState<User | null>(null);
  const [ayudantiaData, setAyudantiaData] = useState<Resource[] | null>(
    initialData,
  );

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const loadAyudantiaData = () => {
    getResource({ slug, type: "AYUDANTIA" }).then(setAyudantiaData);
  };

  const toggleCompleted = (resource: Resource) => {
    toggleResourceCompletion(resource.id, !resource.completed).then(() => {
      loadAyudantiaData();
    });
  };

  if (!ramo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-10 rounded-xl border border-red-900/40 bg-red-950/20">
          <p className="text-red-400 text-sm font-medium">Ramo no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-5 mb-5">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-xs font-medium tracking-wide uppercase transition-all duration-200 hover:gap-2.5 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver
          </button>

          <nav className="flex items-center gap-1.5 text-xs tracking-widest uppercase">
            <span className="text-zinc-600 font-medium">{slug}</span>
            <span className="text-zinc-700">›</span>
            <span className="text-zinc-400 font-medium">Ayudantías</span>
          </nav>
        </div>

        <h2 className="text-xl font-bold sm:text-2xl">{ramo.nombre}</h2>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {ramo.sigla}
        </p>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Revisa las ayudantías disponibles del curso.
        </p>

        <div className="flex gap-3 mt-5">
          <div className="rounded-full border px-4 py-2 text-sm">
            {ayudantiaData?.length ?? "—"} ayudantías
          </div>
          <button
            onClick={() => router.push(`/${slug}`)}
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
          >
            Ver Clases
          </button>
        </div>

        <div className="mt-6">
          {!ayudantiaData ? (
            <div className="flex justify-center items-center py-16">
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
              {[...ayudantiaData].reverse().map((item, index) => (
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
                      router.push(
                        `/${slug}/ayudantias/${ayudantiaData.length - index}`,
                      );
                    }}
                    className="text-left w-full cursor-pointer"
                  >
                    <h4 className="font-bold text-lg">
                      Ayudantía {item.title.split(" ")[1]}
                    </h4>
                    <p className="text-sm text-zinc-500 mt-2">
                      {item.title}
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
                            : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
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
    </div>
  );
}
