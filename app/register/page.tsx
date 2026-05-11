"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnEsEsPackage from "@zxcvbn-ts/language-es-es";
zxcvbnOptions.setOptions({
  translations: zxcvbnEsEsPackage.translations,
});

import { getUser, isUCEmail } from "../utils";
import { register } from "../services/auth";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const router = useRouter();

  const passwordStrength = zxcvbn(password);
  const score = passwordStrength.score;
  const isStrong = score >= 2;
  const isEmailValid = isUCEmail(email);

  useEffect(() => {
    getUser().then((user) => {
      if (user) router.push("/");
    });
  }, []);

  const handleRegister = () => {
    if (!isStrong || !isEmailValid) return;
    register(name, email, password).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al registrarse");
      } else {
        setShowVerifyModal(true);
      }
    });
  };

  const getStrengthColor = () => {
    if (score < 2) return "#ef4444"; // rojo
    if (score < 3) return "#f59e0b"; // amarillo
    return "#22c55e"; // verde
  };

  const getStrengthText = () => {
    if (!password) return "Usa una contraseña segura";
    if (score < 2) return "Contraseña débil";
    if (score < 3) return "Contraseña aceptable";
    return "Contraseña fuerte";
  };

  return (
    <MainLayout title="Crear cuenta" subtitle="Únete a LICC Ramos">
      <div className="min-h-screen from-zinc-100 via-zinc-50 to-white text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <form className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Apodo
                  </label>
                  <input
                    type="text"
                    placeholder="Vic"
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-input px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="victor@estudiante.uc.cl"
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-input px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 text-foreground"
                  />
                  {email && !isEmailValid && (
                    <p className="mt-2 text-xs text-red-500">
                      Debes usar un correo @uc.cl o @estudiante.uc.cl
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-input px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 text-foreground"
                  />

                  <div className="mt-2">
                    <div className="h-2 w-full rounded bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-2 rounded transition-all"
                        style={{
                          width: `${(score + 1) * 20}%`,
                          backgroundColor: getStrengthColor(),
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {getStrengthText()}
                    </p>

                    {password && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {passwordStrength.feedback.warning ||
                          passwordStrength.feedback.suggestions[0]}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                  disabled={!isStrong || !isEmailValid}
                  fullWidth
                  rounded="lg"
                  className="hover:scale-[1.02] disabled:hover:scale-100"
                >
                  Crear cuenta
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <a
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Inicia sesión
                  </a>
                </p>
              </form>
              {showVerifyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-primary">
                      Verifica tu correo UC
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Para completar tu registro, debes iniciar sesión con tu
                      cuenta UC. Serás redirigido al sistema de autenticación.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={() => setShowVerifyModal(false)}
                        className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-muted"
                      >
                        Cancelar
                      </button>

                      <Button
                        onClick={() => {
                          router.push(
                            `${process.env.NEXT_PUBLIC_VERIFY_URL}?service=${process.env.NEXT_PUBLIC_SERVICE_URL}`,
                          );
                        }}
                        variant="primary"
                        className="hover:bg-accent-hover"
                        rounded="md"
                      >
                        Verificar ahora
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
