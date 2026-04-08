import Modal from "@mui/material/Modal";
import { FeatureData } from "../notifications";

import { formatDate } from "../utils";

export default function FeatureModal({
  data,
  open,
  close,
}: {
  data: FeatureData | null;
  open: boolean;
  close: () => void;
}) {
  if (!data) return null;

  return (
    <Modal open={open} onClose={close}>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="rounded-t-3xl bg-gradient-to-br from-blue-50 to-indigo-50 px-6 pt-6 pb-5 dark:from-blue-950/40 dark:to-indigo-950/40">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold tracking-widest text-blue-600 uppercase dark:bg-blue-900/50 dark:text-blue-400">
                ✦ Novedades
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              ¿Qué hay de nuevo?
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {formatDate(data.date)}
            </p>
          </div>

          <div className="flex flex-col gap-3 px-6 py-5">
            {data.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50"
              >
                <span className="mt-0.5 text-2xl leading-none">
                  {feature.emoji}
                </span>
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div>
            {data.footer && (
              <p className="px-6 pb-6 text-sm text-zinc-500 dark:text-zinc-400">
                {data.footer}
              </p>
            )}
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={close}
              className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-95"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
