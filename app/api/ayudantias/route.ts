import fs from "fs";

export async function GET() {
  const ramosFolders = fs
    .readdirSync("public", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const cantidadRamos = ramosFolders.length;
  if (cantidadRamos === 0) {
    return new Response(JSON.stringify({ error: "No se encontraron ramos" }));
  }

  const response = [];

  for (const ramoFolder of ramosFolders) {
    const ayudantiasPath = `public/${ramoFolder}/Ayudantias`;

    if (!fs.existsSync(ayudantiasPath)) {
      // TODO: debería pasar??
      return new Response(
        JSON.stringify({
          error: `No se encontró la carpeta Ayudantias para el ramo ${ramoFolder}`,
        }),
      );
    }

    const ayudantiasFiles = fs
      .readdirSync(ayudantiasPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    response.push({
      ramo: ramoFolder,
      ayudantiasPath: ayudantiasPath.replace("public/", ""),
      ayudantiasFiles: ayudantiasFiles.sort((a, b) => {
        const aNumber = parseInt(a.split("Ayudantia_")[1]);
        const bNumber = parseInt(b.split("Ayudantia_")[1]);
        return aNumber - bNumber;
      }),
    });
  }

  return new Response(JSON.stringify(response));
}
