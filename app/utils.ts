import ramosJson from "./ramos.json";
const ramos: RamoInterface[] = ramosJson;

export const baseURL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export function stringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(dateString: string): string {
  const date = stringToDate(dateString);
  return date.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = stringToDate(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
}

export function getUser(): Promise<User | null> {
  // TODO: cache this?
  return fetch("/api/auth/me")
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        return null;
      }
      return data;
    });
}

export function isUCEmail(email: string): boolean {
  const ucEmailRegex = /^[^\s@]+@(uc\.cl|estudiante\.uc\.cl)$/;
  return ucEmailRegex.test(email);
}

export interface InfoClase {
  clase: number;
  fecha: string;
  objetivo: string;
  contenido: string;
  texto_guia?: string;
  interrogacion?: number;
}

export interface InfoInterrogacion {
  interrogacion: number;
  fecha: string;
}

export interface RamoInterface {
  sigla: string;
  nombre: string;
  descripcion: string;
  clases: number;
  url: string;
  info_clases: InfoClase[];
  info_interrogaciones: InfoInterrogacion[];
}

export function getRamo(slug: string): RamoInterface | null {
  return (
    ramos.find(
      (ramo) => ramo.sigla.toLocaleLowerCase() === slug.toLowerCase(),
    ) || null
  );
}
