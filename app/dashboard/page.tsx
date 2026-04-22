"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/app/components/layout/MainLayout";
import { uploadFile } from "../services/resources";

import AdminGuard from "../guards/AdminGuard";

const typeToCFFolder = {
  AYUDANTIA: "Ayudantias",
  WORKSHOP: "Talleres",
};

export default function Dashboard() {
  const [slug, setSlug] = useState<string>("");
  const [type, setType] = useState<"AYUDANTIA" | "WORKSHOP" | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const handleUploadFile = async () => {
    if (!slug || !type || !file) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await uploadFile(file, {
        title: file.name,
        key: `${slug}/${typeToCFFolder[type]}/${file.name}`,
        url: `${slug}/${typeToCFFolder[type]}/${file.name}`,
        type,
        slug,
      });
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <MainLayout title="Dashboard">
        <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl bg-zinc-900 text-zinc-100 shadow-xl border border-zinc-800 space-y-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Subir recurso
          </h1>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Curso</label>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700  rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="" disabled>
                Selecciona curso
              </option>
              <option value="MAT1107">MAT1107</option>
              <option value="MAT1207">MAT1207</option>
              <option value="Talleres">Talleres</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-zinc-800 border border-zinc-700  rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="" disabled>
                Selecciona tipo
              </option>
              <option value="AYUDANTIA">Ayudantía</option>
              <option value="WORKSHOP">Taller</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Archivo</label>

            <div className="border-2 border-dashed border-zinc-700  rounded-xl p-6 text-center cursor-pointer hover:bg-zinc-800/60 transition">
              <input
                type="file"
                className="hidden"
                id="fileUpload"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />

              <label htmlFor="fileUpload" className="cursor-pointer">
                {file ? (
                  <div className="text-sm text-zinc-200">
                    <span className="font-medium">{file.name}</span>
                  </div>
                ) : (
                  <div className="text-zinc-500">
                    Arrastra un archivo o haz click para subir
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            onClick={handleUploadFile}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-lg  font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Subiendo..." : "Subir archivo"}
          </button>
        </div>
      </MainLayout>
    </AdminGuard>
  );
}
