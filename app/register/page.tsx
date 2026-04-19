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
        alert(data.message || "Error al registrarse");
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
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <form className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Víctor"
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="victor@estudiante.uc.cl"
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  {email && !isEmailValid && (
                    <p className="mt-2 text-xs text-red-500">
                      Debes usar un correo @uc.cl o @estudiante.uc.cl
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
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

                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      {getStrengthText()}
                    </p>

                    {password && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {passwordStrength.feedback.warning ||
                          passwordStrength.feedback.suggestions[0]}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                  disabled={!isStrong || !isEmailValid}
                  className="w-full rounded-xl bg-blue-600 py-2 text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:bg-blue-700"
                >
                  Crear cuenta
                </button>

                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  ¿Ya tienes cuenta?{" "}
                  <a
                    href="/login"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Inicia sesión
                  </a>
                </p>
              </form>
              {showVerifyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Verifica tu correo UC
                    </h2>

                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      Para completar tu registro, debes iniciar sesión con tu
                      cuenta UC. Serás redirigido al sistema de autenticación.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={() => setShowVerifyModal(false)}
                        className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Cancelar
                      </button>

                      <button
                        onClick={() => {
                          router.push(
                            `${process.env.NEXT_PUBLIC_VERIFY_URL}?service=${process.env.NEXT_PUBLIC_SERVICE_URL}`,
                          );
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        Verificar ahora
                      </button>
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
