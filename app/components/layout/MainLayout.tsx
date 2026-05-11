"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";

import UserDropdown from "../UserDropdown";

import { getUser, User } from "@/app/utils";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-11 w-36 rounded-xl border border-border bg-card" />
    );
  }

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="h-11 rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow-sm outline-none transition hover:opacity-90 cursor-pointer"
    >
      <option value="light">☀️ Claro</option>

      <option value="dark">🌙 Oscuro</option>

      <option value="light-pink">🌸 Rosa claro</option>

      <option value="dark-pink">🌺 Rosa oscuro</option>
    </select>
  );
}

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function MainLayout({
  children,
  title,
  subtitle,
  badge,
}: Props) {
  const [user, setuser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    getUser().then((data) => {
      setuser(data);

      setLoading(false);
    });
  }, []);

  return (
    <div className=" bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-10">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              {pathname !== "/" && (
                <button
                  title="Ir al inicio"
                  onClick={() => router.push("/")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition hover:scale-105 hover:text-foreground cursor-pointer"
                >
                  <HomeIcon sx={{ fontSize: 22 }} />
                </button>
              )}

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {title}
              </h1>
            </div>

            {subtitle && (
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {!loading && <UserDropdown user={user} />}

            {user && user.role == "ADMIN" && (
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition hover:scale-105 hover:opacity-90 cursor-pointer"
              >
                <DashboardIcon sx={{ fontSize: 22 }} />
              </button>
            )}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
