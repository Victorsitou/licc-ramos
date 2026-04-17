"use client";

import { useState, useEffect } from "react";
import { getUser } from "../utils";

import { login } from "../services/auth";

import MainLayout from "../components/layout/MainLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getUser().then((user) => {
      if (user) window.location.href = "/";
    });
  }, []);

  const handleLogin = () => {
    login(email, password).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error al iniciar sesión");
      } else {
        window.location.href = "/";
      }
    });
  };

  return (
    <MainLayout title="Inicia sesión" subtitle="Accede a LICC Ramos">
      <div className="min-h-screen from-zinc-100 via-zinc-50 to-white text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <form className="space-y-5">
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
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  className="w-full rounded-xl bg-blue-600 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-blue-700"
                >
                  Iniciar sesión
                </button>

                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/register"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Regístrate aquí
                  </a>
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
