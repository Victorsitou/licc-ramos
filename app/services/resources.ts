import { authedFetch } from "./api";
import { RamoInterface } from "@/app/utils";

export interface Resource {
  id: string;
  title: string;
  url: string; // DEPRECATED
  key: string;
  type: "CLASS" | "AYUDANTIA" | "WORKSHOP";
  slug: string;
  orderIndex: number;
  createdAt: string;
  completed: boolean;
  completedAt: string | null;
}

export async function getResource({
  slug,
  type,
  orderIndex,
}: {
  slug?: string;
  type?: "CLASS" | "AYUDANTIA" | "WORKSHOP";
  orderIndex?: number;
}): Promise<Resource[]> {
  const response = await authedFetch(
    `/api/resources?${new URLSearchParams({
      ...(slug ? { slug } : {}),
      ...(type ? { type } : {}),
      ...(orderIndex !== undefined
        ? { orderIndex: orderIndex.toString() }
        : {}),
    })}`,
  );
  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function getResourceByIndex(
  slug: string,
  type: "AYUDANTIA" | "WORKSHOP" | "CLASS",
  orderIndex: number,
): Promise<Resource | null> {
  const resources = await getResource({ slug, type, orderIndex });
  return resources[0] || null;
}

export async function toggleResourceCompletion(
  resourceId: string,
  completed: boolean,
) {
  let url = "";
  let method: "POST" | "DELETE";
  if (completed) {
    url = `/api/resources/${resourceId}/complete`;
    method = "POST";
  } else {
    url = `/api/resources/${resourceId}/complete`;
    method = "DELETE";
  }

  const response = await authedFetch(url, { method });

  if (!response.ok) {
    throw new Error("Failed to toggle resource completion");
  }
  return response.json();
}

export async function getFileURL(key: string) {
  const res = await authedFetch(`/api/file-url?key=${encodeURIComponent(key)}`);
  if (!res.ok) {
    throw new Error("Failed to get file URL");
  }
  const data = await res.json();
  return data.url;
}

export async function uploadFile(
  file: File,
  resourceData: Omit<
    Resource,
    "id" | "createdAt" | "orderIndex" | "completed" | "completedAt"
  >,
) {
  const res = await authedFetch("/api/resources/cf", {
    method: "POST",
    body: JSON.stringify({
      content: await file
        .arrayBuffer()
        .then((buffer) => Buffer.from(buffer).toString("base64")),
      resourceData,
    }),
  });
  return res.json();
}

export async function fillClasses(ramo: RamoInterface): Promise<RamoInterface> {
  if (!ramo.metadata?.has_classes) {
    const classes = await getResource({
      slug: ramo.sigla,
      type: "CLASS",
    });
    if (classes.length > 0) {
      ramo.info_clases = classes.map((c) => ({
        clase: c.orderIndex + 1,
        fecha: c.createdAt.split("T")[0],
        objetivo: c.title,
        contenido: "",
      }));
      ramo.clases = classes.length;
    }
  }
  return ramo;
}