"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/app/components/Button";
import Breadcrumb from "@/app/components/Breadcrumb";
import { getRamo, getUser, User, RamoInterface } from "../../utils";
import {
  getResource,
  toggleResourceCompletion,
  Resource,
} from "@/app/services/resources";

import LockIcon from "@mui/icons-material/Lock";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import dayjs from "@lib/dayjs";

export default function ExtrasPage({
  initialData,
}: {
  initialData: Resource[];
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [ramo, setRamo] = useState<RamoInterface | null>(null);
  const [loadingRamo, setLoadingRamo] = useState(typeof slug === "string");
  const [user, setUser] = useState<User | null>(null);
  const [extraData, setExtraData] = useState<Resource[] | null>(initialData);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  useEffect(() => {
    if (!slug || typeof slug !== "string") {
      return;
    }

    async function fetchRamo() {
      setLoadingRamo(true);
      const fetchedRamo = await getRamo(slug as string);
      setRamo(fetchedRamo);
      setLoadingRamo(false);
    }

    fetchRamo();
  }, [slug]);

  const loadExtraData = () => {
    if (typeof slug === "string") {
      getResource({ slug, type: "EXTRA" }).then(setExtraData);
    }
  };

  const toggleCompleted = (resource: Resource) => {
    toggleResourceCompletion(resource.id, !resource.completed).then(() => {
      loadExtraData();
    });
  };

  if (loadingRamo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-zinc-300 border-t-blue-500 rounded-full" />
      </div>
    );
  }

  if (!ramo || typeof slug !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-10 rounded-xl border border-red-900/40 bg-red-950/20">
          <p className="text-red-400 text-sm font-medium">Ramo no encontrado</p>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-zinc-400 underline hover:text-zinc-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="rounded-3xl border border-border bg-card p-6 text-left shadow-sm transition">
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

          <Breadcrumb items={[{ label: ramo.sigla }, { label: "Extras" }]} />
        </div>

        <h2 className="text-xl font-bold sm:text-2xl">{ramo.nombre}</h2>
        <p className="text-sm font-semibold text-primary">{ramo.sigla}</p>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Revisa el material extra disponible del curso.
        </p>

        <div className="flex gap-4 mt-5">
          <div className="rounded-full border border-border border-2 px-4 py-2 text-sm">
            {extraData?.length ?? "—"} recursos extra
          </div>
          <Button onClick={() => router.push(`/${slug}`)}>Ver Clases</Button>
        </div>

        <div className="mt-6">
          {!extraData ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin h-8 w-8 border-2 border-zinc-300 border-t-blue-500 rounded-full" />
            </div>
          ) : extraData.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6">
              {!user ? (
                <>
                  <div className="mb-4 text-zinc-400">
                    <LockIcon sx={{ fontSize: 48 }} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    Inicia sesión
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    Necesitas iniciar sesión para ver el material extra
                    disponible y guardar tu progreso.
                  </p>
                </>
              ) : !user.verified ? (
                <>
                  <div className="mb-4 text-zinc-400">
                    <LockIcon sx={{ fontSize: 48 }} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    Verifica tu cuenta
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    Necesitas verificar tu cuenta para ver el material extra y
                    guardar tu progreso. Mándanos un correo a{" "}
                    <a
                      href="mailto:vvegaa5@estudiante.uc.cl"
                      className="text-primary underline"
                    >
                      aquí
                    </a>{" "}
                    para verificar tu cuenta.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 text-zinc-400">
                    <MenuBookIcon sx={{ fontSize: 48 }} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    No hay material extra disponible
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    Aún no se han publicado recursos extra, intenta nuevamente
                    más tarde.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {[...extraData].reverse().map((item, index) => (
                <div
                  key={item.key}
                  className={`group rounded-2xl border p-5 shadow-sm transition
                    ${
                      item.completed
                        ? "bg-success-soft border-green-400"
                        : "bg-card border-border"
                    }`}
                >
                  <button
                    onClick={() =>
                      router.push(
                        `/${slug}/extras/${extraData.length - index}`,
                      )
                    }
                    className="text-left w-full cursor-pointer"
                  >
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    {item.completed && (
                      <p className="text-sm text-zinc-500 mt-2">
                        Completado {dayjs(item.completedAt).fromNow()}
                      </p>
                    )}
                    <div className="mt-4 text-sm font-semibold text-primary group-hover:underline">
                      Ver material →
                    </div>
                  </button>

                  {user && (
                    <Button
                      onClick={() => toggleCompleted(item)}
                      className="mt-4"
                      fullWidth
                      rounded="lg"
                      variant={item.completed ? "success" : "primary"}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {item.completed && (
                          <CheckCircleIcon sx={{ fontSize: 18 }} />
                        )}
                        <span>
                          {item.completed
                            ? "Marcado como completado"
                            : "Marcar como completado"}
                        </span>
                      </div>
                    </Button>
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
