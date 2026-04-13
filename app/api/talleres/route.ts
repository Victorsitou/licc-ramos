const GITHUB_API =
  "https://api.github.com/repos/Victorsitou/licc-ramos/contents";

export async function GET() {
  const talleres = await fetch(
    `${GITHUB_API}/public/Talleres?ref=feat/talleres`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.raw+json",
        "X-GitHub-Api-Version": "2026-03-10",
      },
    },
  ).then((r) => r.json());

  const response = [];

  for (const taller of talleres) {
    response.push({
      name: taller.name,
      url: taller.download_url,
    });
  }

  return new Response(JSON.stringify(response));
}
