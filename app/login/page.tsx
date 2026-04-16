"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { getUser } from "../utils";

import MainLayout from "../components/layout/MainLayout";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <LightModeIcon fontSize="small" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:scale-105 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      {isDark ? (
        <LightModeIcon fontSize="small" />
      ) : (
        <DarkModeIcon fontSize="small" />
      )}
    </button>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getUser().then((user) => {
      if (user) window.location.href = "/";
    });
  }, []);

  const login = () => {
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        alert(data.error);
      } else {
        window.location.href = "/";
      }
    });
  };

  return (
    <MainLayout
      title="Inicia sesión"
      subtitle="Accede a tu repositorio de clases"
    >
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
                    login();
                  }}
                  className="w-full rounded-xl bg-blue-600 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-blue-700"
                >
                  Iniciar sesión
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
