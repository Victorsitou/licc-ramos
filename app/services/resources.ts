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

export async function getResource(): Promise<Resource[]> {
  const response = await fetch("/api/resources");

  if (!response.ok) {
    return [];
  }

  return response.json();
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

  const response = await fetch(url, { method });

  if (!response.ok) {
    throw new Error("Failed to toggle resource completion");
  }
  return response.json();
}

export async function getFileURL(key: string) {
  const res = await fetch(`/api/file-url?key=${encodeURIComponent(key)}`);
  if (!res.ok) {
    throw new Error("Failed to get file URL");
  }
  const data = await res.json();
  return data.url;
}
