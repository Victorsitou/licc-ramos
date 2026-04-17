"use client";

import { useState, useEffect } from "react";
import { getUser } from "../utils";

import { register } from "../services/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getUser().then((user) => {
      if (user) {
        window.location.href = "/";
      }
    });
  }, []);

  const handleRegister = () => {
    register(name, email, password).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error al registrarse");
      } else {
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          Registrarse
        </h2>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Víctor"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              placeholder="victor@estudiante.uc.cl"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-5₀ focus:ring-blue-5₀ dark:border-gray-6₀ dark:bg-gray-7₀ dark:text-gray-2₀"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-6₀ px-4 py-2 text-sm font-medium text-white hover:bg-blue-7₀ focus:outline-none focus:ring-2 focus:ring-blue-5₀ focus:ring-offset-2"
            onClick={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
