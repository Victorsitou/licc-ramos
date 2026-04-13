const GITHUB_API =
  "https://api.github.com/repos/Victorsitou/licc-ramos/contents";

export async function GET() {
  // Leer carpetas raíz de public/
  const ramosFolders = await fetch(`${GITHUB_API}/public`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.raw+json",
      "X-GitHub-Api-Version": "2026-03-10",
    },
  }).then((r) => r.json());

  const response = [];

  for (const ramo of ramosFolders.filter(
    (f: any) => f.type === "dir" && f.name.startsWith("MAT"),
  )) {
    // Leer archivos de cada Ayudantias/
    const ayudantias = await fetch(
      `${GITHUB_API}/public/${ramo.name}/Ayudantias`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    ).then((r) => r.json());

    const files = ayudantias
      .filter((f: any) => f.type === "file")
      .map((f: any) => ({ name: f.name, url: f.download_url }))
      .sort((a: { name: string }, b: { name: string }) => {
        a.name = a.name.replace("í", "i");
        b.name = b.name.replace("í", "i");
        const aNumber = parseInt(a.name.split("Ayudantia_")[1]);
        const bNumber = parseInt(b.name.split("Ayudantia_")[1]);
        return aNumber - bNumber;
      });

    response.push({
      ramo: ramo.name,
      ayudantiasPath: `${ramo.name}/Ayudantias`,
      ayudantiasFiles: files,
    });
  }

  return new Response(JSON.stringify(response));
}
