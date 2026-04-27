import AyudantiasPage from "./AyudantiasPage";
import { getResourceServer } from "@/app/services/resources-server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const query = await params;
  if (typeof query.slug !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-10 rounded-xl border border-red-900/40 bg-red-950/20">
          <p className="text-red-400 text-sm font-medium">Ramo no encontrado</p>
        </div>
      </div>
    );
  }
  const data = await getResourceServer({
    slug: query.slug,
    type: "AYUDANTIA",
  });

  return <AyudantiasPage initialData={data} />;
}
