import { baseURL } from "../utils";

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
  const response = await fetch(
    `${baseURL}/api/resources?${new URLSearchParams({
      ...(slug ? { slug } : {}),
      ...(type ? { type } : {}),
      ...(orderIndex !== undefined
        ? { orderIndex: orderIndex.toString() }
        : {}),
    })}`,
    {
      cache: "no-store",
    },
  );
  console.log(response.url);
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
    url = `${baseURL}/api/resources/${resourceId}/complete`;
    method = "POST";
  } else {
    url = `${baseURL}/api/resources/${resourceId}/complete`;
    method = "DELETE";
  }

  const response = await fetch(url, { method });

  if (!response.ok) {
    throw new Error("Failed to toggle resource completion");
  }
  return response.json();
}

export async function getFileURL(key: string) {
  const res = await fetch(
    `${baseURL}/api/file-url?key=${encodeURIComponent(key)}`,
  );
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
  const res = await fetch(`${baseURL}/api/resources/cf`, {
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
