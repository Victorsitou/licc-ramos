import ExtrasPage from "./ExtrasPage";
import { getResourceServer } from "@/app/services/resources-server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const query = await params;
  if (typeof query.slug !== "string") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive bg-destructive-soft p-10">
          <span className="text-3xl">⚠</span>
          <p className="text-sm font-medium text-destructive">
            Ramo no encontrado
          </p>
        </div>
      </div>
    );
  }

  const data = await getResourceServer({
    slug: query.slug,
    type: "EXTRA",
  });

  return <ExtrasPage initialData={data} />;
}
