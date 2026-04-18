export interface Resource {
  id: string;
  title: string;
  url: string;
  type: "CLASS" | "AYUDANTIA" | "WORKSHOP";
  slug: string;
  orderIndex: number;
  createdAt: string;
  completed: boolean;
  completedAt: string | null;
}

export async function getResource(): Promise<Resource[]> {
  // TODO: implement cache
  const response = await fetch("/api/resources");

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
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
