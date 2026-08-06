import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { getCurrentUser } from "@/src/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const archivos = await fs.readdir(process.cwd() + "/app/cursos", {
      withFileTypes: true,
    });

    const archivosFiltrados = archivos
      .filter((archivo) => archivo.isFile() && archivo.name.endsWith(".json"))
      .map((archivo) => archivo.name);

    const ramos = [];

    for (const archivo of archivosFiltrados) {
      const data = await fs.readFile(
        process.cwd() + "/app/cursos/" + archivo,
        "utf-8",
      );
      const jsonData = JSON.parse(data);
      ramos.push(jsonData);
    }

    return NextResponse.json(ramos);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error al leer los ramos", { status: 500 });
  }
}
