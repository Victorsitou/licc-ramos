"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";

import UserDropdown from "../UserDropdown";

import { getUser, User } from "@/app/utils";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-11 w-11 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:scale-105 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
    >
      {isDark ? (
        <LightModeIcon fontSize="small" />
      ) : (
        <DarkModeIcon fontSize="small" />
      )}
    </button>
  );
}

interface Props {
  children: ReactNode;
}

export default function Header({ children }: Props) {
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
    <div className="bg-gradient-to-b from-zinc-100 via-zinc-50 to-white text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
      <main className="mx-auto flex flex-col px-6 py-10 sm:px-10">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              {pathname !== "/" && (
                <button
                  title="Ir al inicio"
                  onClick={() => router.push("/")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm text-zinc-400 transition hover:scale-105 hover:shadow-md hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:text-white cursor-pointer"
                >
                  <HomeIcon sx={{ fontSize: 22 }} />
                </button>
              )}

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                LICC Ramos
              </h1>
            </div>
          </div>
          <div className="flex items-right gap-3">
            <ThemeToggle />
            {!loading && <UserDropdown user={user} />}
            {user && user.role == "ADMIN" && (
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:scale-105 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
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
