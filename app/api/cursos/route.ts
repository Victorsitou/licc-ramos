import { NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET() {
  try {
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

    // Recursivo
    const archivosRecursivos = await fs.readdir(process.cwd() + "/app/cursos", {
      withFileTypes: true,
    });

    for (const archivo of archivosRecursivos) {
      if (archivo.isDirectory()) {
        const subArchivos = await fs.readdir(
          process.cwd() + "/app/cursos/" + archivo.name,
          { withFileTypes: true },
        );
        for (const subArchivo of subArchivos) {
          if (subArchivo.isFile() && subArchivo.name.endsWith(".json")) {
            const data = await fs.readFile(
              process.cwd() +
                "/app/cursos/" +
                archivo.name +
                "/" +
                subArchivo.name,
              "utf-8",
            );
            const jsonData = JSON.parse(data);
            ramos.push(jsonData);
          }
        }
      }
    }

    return NextResponse.json(ramos);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error al leer los ramos", { status: 500 });
  }
}
