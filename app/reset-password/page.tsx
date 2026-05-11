"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnEsEsPackage from "@zxcvbn-ts/language-es-es";
import MainLayout from "../components/layout/MainLayout";

import { resetPassword } from "../services/auth";
import { isUCEmail } from "../utils";

zxcvbnOptions.setOptions({
  translations: zxcvbnEsEsPackage.translations,
});

function RequestResetForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const isEmailValid = isUCEmail(email);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <form className="space-y-5">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="victor@estudiante.uc.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
          {email && !isEmailValid && (
            <p className="mt-2 text-xs text-red-500">
              Debes usar un correo @uc.cl o @estudiante.uc.cl
            </p>
          )}
        </div>

        <button
          onClick={() => {
            router.push(
              `${process.env.NEXT_PUBLIC_VERIFY_URL}?service=${process.env.NEXT_PUBLIC_REQUEST_PASSWORD_SERVICE_URL}`,
            );
          }}
          disabled={!email}
          className="w-full rounded-xl bg-blue-600 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Recuperar contraseña
        </button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          <a
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Volver al inicio de sesión
          </a>
        </p>
      </form>
    </div>
  );
}

function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const passwordStrength = zxcvbn(password);
  const score = passwordStrength.score;
  const isStrong = score >= 2;
  const mismatch = confirm.length > 0 && password !== confirm;
  const valid = isStrong && confirm.length > 0 && password === confirm;

  const getStrengthColor = () => {
    if (score < 2) return "#ef4444";
    if (score < 3) return "#f59e0b";
    return "#22c55e";
  };

  const getStrengthText = () => {
    if (!password) return "Usa una contraseña segura";
    if (score < 2) return "Contraseña débil";
    if (score < 3) return "Contraseña aceptable";
    return "Contraseña fuerte";
  };

  const handleSubmit = async () => {
    if (!valid) return;
    setLoading(true);
    try {
      resetPassword(token, password).then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Error al cambiar la contraseña");
        } else {
          setDone(true);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-3">
        <h1 className="text-zinc-800 dark:text-zinc-100 text-2xl font-semibold">
          ¡Contraseña actualizada!
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <a
          href="/login"
          className="inline-block mt-2 text-sm text-blue-600 hover:underline font-medium"
        >
          Ir al inicio de sesión
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <form className="space-y-5">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nueva contraseña
          </label>
          <input
            type="password"
            placeholder="********"
            value={password}
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

        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Confirmar contraseña
          </label>
          <input
            type="password"
            placeholder="Repite la contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={`mt-2 w-full rounded-xl border bg-zinc-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 dark:bg-zinc-800 ${
              mismatch
                ? "border-red-400 dark:border-red-500"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          />
          {mismatch && (
            <p className="mt-1 text-xs text-red-500">
              Las contraseñas no coinciden
            </p>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          disabled={loading || !valid}
          className="w-full rounded-xl bg-blue-600 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}

function ResetPasswordContent() {
  const token = useSearchParams().get("token");
  const isReset = Boolean(token);

  return (
    <MainLayout
      title={isReset ? "Nueva contraseña" : "Recuperar contraseña"}
      subtitle="Accede a LICC Ramos"
    >
      <div className="min-h-screen from-zinc-100 via-zinc-50 to-white text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            {isReset ? (
              <ResetPasswordForm token={token!} />
            ) : (
              <RequestResetForm />
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}

export default function PasswordRecoveryPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
