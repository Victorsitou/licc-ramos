"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import MainLayout from "@/app/components/layout/MainLayout";
import Footer from "@/app/components/Footer";
import Breadcrumb from "@/app/components/Breadcrumb";
import Button from "@/app/components/Button";

import { getUser, User } from "@/app/utils";
import {
  getProblemCollection,
  ProblemCollectionDetail,
  toggleProblemCompletion,
} from "@/app/services/problem-collections";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import MenuBookIcon from "@mui/icons-material/MenuBook";

interface ProblemCollectionDetailPageProps {
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  collectionLabel: string;
}

export default function ProblemCollectionDetailPage({
  title,
  subtitle,
  breadcrumbLabel,
  collectionLabel,
}: ProblemCollectionDetailPageProps) {
  const params = useParams();
  const router = useRouter();

  const { id } = params;

  const [user, setUser] = useState<User | null>(null);
  const [collection, setCollection] = useState<ProblemCollectionDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const loadCollection = async (collectionId: string) => {
    try {
      setLoading(true);
      const data = await getProblemCollection(collectionId);
      if (!data) {
        setError("Coleccion no encontrada");
        setCollection(null);
        return;
      }
      setCollection(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar la coleccion.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof id !== "string") {
      setError("Coleccion no encontrada");
      setLoading(false);
      return;
    }

    loadCollection(id);
  }, [id]);

  const toggleCompleted = (problemId: string, completed: boolean) => {
    toggleProblemCompletion(problemId, completed).then(() => {
      if (typeof id === "string") {
        loadCollection(id);
      }
    });
  };

  const currentTitle = collection?.title || title;

  return (
    <MainLayout title={currentTitle} subtitle={subtitle} badge="LICC">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
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

            <Breadcrumb
              items={[{ label: breadcrumbLabel }, { label: currentTitle }]}
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            {subtitle}
          </p>
          <h2 className="text-xl font-bold sm:text-2xl">{currentTitle}</h2>

          <p className="mt-4 text-sm text-muted-foreground">
            {collection?.description ||
              "Revisa el listado de ejercicios disponibles."}
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <div className="rounded-full border-2 border-border px-4 py-2 text-sm">
              {collection?.problems.length ?? "—"} problemas
            </div>
            {collection && (
              <div className="rounded-full border-2 border-border px-4 py-2 text-sm">
                {collection.progress.completed}/{collection.progress.total} completados
              </div>
            )}
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin h-8 w-8 border-2 border-zinc-300 border-t-blue-500 rounded-full" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="mb-4 text-zinc-400">
                  <LockIcon sx={{ fontSize: 48 }} />
                </div>
                <h3 className="text-lg font-semibold text-primary">
                  {error}
                </h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  Verifica tu sesion e intenta nuevamente.
                </p>
              </div>
            ) : collection?.problems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                {!user ? (
                  <>
                    <div className="mb-4 text-zinc-400">
                      <LockIcon sx={{ fontSize: 48 }} />
                    </div>
                    <h3 className="text-lg font-semibold text-primary">
                      Inicia sesion
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                      Necesitas iniciar sesion para ver los ejercicios y guardar tu progreso.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 text-zinc-400">
                      <MenuBookIcon sx={{ fontSize: 48 }} />
                    </div>
                    <h3 className="text-lg font-semibold text-primary">
                      No hay ejercicios disponibles
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                      Aun no se han publicado ejercicios para este {collectionLabel.toLowerCase()}.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {collection?.problems.map((problem) => (
                  <div
                    key={problem.id}
                    className={`group rounded-2xl border p-5 shadow-sm transition
                      ${
                        problem.completed
                          ? "bg-success-soft border-green-400"
                          : "bg-card border-border"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Problema #{problem.orderIndex}
                        </div>
                        <h4 className="font-bold text-lg">{problem.title}</h4>
                        {problem.description && (
                          <p className="text-sm text-zinc-500 mt-2">
                            {problem.description}
                          </p>
                        )}
                      </div>
                      {problem.completed && (
                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                      )}
                    </div>

                    {user?.verified && (
                      <Button
                        onClick={() =>
                          toggleCompleted(problem.id, !problem.completed)
                        }
                        className="mt-4"
                        fullWidth
                        rounded="lg"
                        variant={problem.completed ? "success" : "primary"}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {problem.completed && (
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                          )}
                          <span>
                            {problem.completed
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

        <div className="mt-auto pt-14">
          <Footer />
        </div>
      </main>
    </MainLayout>
  );
}