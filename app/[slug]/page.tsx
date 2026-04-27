"use client";

import { useState, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";

import Clases from "../components/Clases";

import { getRamo } from "../utils";

export default function ClasesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const params = useParams();
  const slug = params.slug;
  if (typeof slug !== "string") {
    return router.push("/");
  }
  const [ramo] = useState(getRamo(slug));

  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [highlight, setHighlight] = useState(false);

  if (!ramo) {
    return <div>Ramo no encontrado</div>;
  }

  const scrollToNext = () => {
    const el = nextRef.current;
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const checkIfCentered = () => {
      const rect = el.getBoundingClientRect();
      const isCentered = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isCentered) {
        setHighlight(true);
        setTimeout(() => setHighlight(false), 1500);
      } else {
        requestAnimationFrame(checkIfCentered);
      }
    };

    requestAnimationFrame(checkIfCentered);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-5 mb-5">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-xs font-medium tracking-wide uppercase transition-all duration-200 hover:gap-2.5 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 3L5 8L10 13"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Volver
              </button>

              <nav className="flex items-center gap-1.5 text-xs tracking-widest uppercase">
                <span className="text-zinc-600 font-medium">{slug}</span>
              </nav>
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">{ramo.nombre}</h2>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {ramo.sigla}
            </p>
          </div>
        </div>

        <p className="mt-4 text-m text-zinc-600 dark:text-zinc-400">
          {ramo.descripcion}
        </p>

        <div className="flex gap-4 mt-5">
          <div className="rounded-full border px-4 py-2 text-sm">
            {ramo.clases} clases
          </div>

          <button
            onClick={() => router.push(`${pathname}/ayudantias`)}
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
          >
            Ver Ayudantías
          </button>
        </div>
        <div className="mt-5">
          <Clases
            ramo={ramo}
            nextRef={nextRef}
            highlight={highlight}
            onScrollToNext={scrollToNext}
          />
        </div>
      </div>
    </div>
  );
}
