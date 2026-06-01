"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getUser } from "../utils";
import { login } from "../services/auth";

import MainLayout from "../components/layout/MainLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    getUser().then((user) => {
      if (user) router.push("/");
    });
  }, []);

  const handleLogin = () => {
    let userEmail = email.trim().toLowerCase();
    if (!userEmail.split("@")[1]?.endsWith("estudiante.uc.cl")) {
      userEmail = userEmail + "@estudiante.uc.cl";
    }
    login(userEmail, password).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al iniciar sesión");
      } else {
        router.push("/");
      }
    });
  };

  return (
    <MainLayout title="Inicia sesión" subtitle="Accede a LICC Ramos">
      <div className="min-h-screen text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
              <form className="space-y-5">
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
                  <a
                    href="/reset-password"
                    className="mt-2 block text-sm text-right text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  className="w-full rounded-xl bg-primary py-2 text-sm font-medium text-primary-foreground transition hover:scale-[1.01] hover:opacity-90"
                >
                  Iniciar sesión
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/register"
                    className="font-medium text-primary hover:underline"
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
