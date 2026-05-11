"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnEsEsPackage from "@zxcvbn-ts/language-es-es";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/Button";

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
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <form className="space-y-5">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="victor@estudiante.uc.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-input px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 text-foreground"
          />
          {email && !isEmailValid && (
            <p className="mt-2 text-xs text-red-500">
              Debes usar un correo @uc.cl o @estudiante.uc.cl
            </p>
          )}
        </div>

        <Button
          onClick={() => {
            router.push(
              `${process.env.NEXT_PUBLIC_VERIFY_URL}?service=${process.env.NEXT_PUBLIC_REQUEST_PASSWORD_SERVICE_URL}`,
            );
          }}
          disabled={!email || !isEmailValid}
          className="hover:scale-[1.02] disabled:hover:scale-100"
          fullWidth
          rounded="lg"
        >
          Recuperar contraseña
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <a href="/login" className="font-medium text-primary hover:underline">
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
          const data = await res.text();
          alert(data || "Error al cambiar la contraseña");
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
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm text-center space-y-3">
        <h1 className="text-primary text-2xl font-semibold">
          ¡Contraseña actualizada!
        </h1>
        <p className="text-sm text-muted-foreground">
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <a
          href="/login"
          className="inline-block mt-2 text-sm text-primary hover:underline font-medium"
        >
          Ir al inicio de sesión
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <form className="space-y-5">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Nueva contraseña
          </label>
          <input
            type="password"
            placeholder="********"
            value={password}
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

        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Confirmar contraseña
          </label>
          <input
            type="password"
            placeholder="Repite la contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={`mt-2 w-full rounded-xl border border-border bg-input px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 text-foreground
              ${mismatch ? "border-destructive dark:border-destructive" : ""}`}
          />
          {mismatch && (
            <p className="mt-1 text-xs text-destructive">
              Las contraseñas no coinciden
            </p>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          disabled={loading || !valid}
          className="hover:scale-[1.02] disabled:hover:scale-100"
          fullWidth
          rounded="lg"
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </Button>
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
