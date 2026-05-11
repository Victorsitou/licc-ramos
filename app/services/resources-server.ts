import { Resource } from "./resources";
import { baseURL } from "../utils";
import { cookies } from "next/headers";

export async function getResourceServer({
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
      headers: { cookie: (await cookies()).toString() },
    },
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}
