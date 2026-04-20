"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { User } from "../utils";

import { logout } from "../services/auth";

export default function UserDropdown({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900"
      >
        Iniciar sesión
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-11 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
      >
        Hola, {user.name}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-red-100 dark:hover:bg-red-800"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
