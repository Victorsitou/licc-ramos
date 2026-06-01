export type ProblemCollectionType =
  | "SET"
  | "COMPILADO"
  | "INTERROGACION"
  | "ACTIVIDAD";

export interface Problem {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  completed?: boolean;
}

export interface ProblemCollection {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  type: ProblemCollectionType;
  problems?: Problem[];
}

export interface ProblemCollectionDetail extends ProblemCollection {
  problems: Problem[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export async function getProblemCollectionsByType(
  type: ProblemCollectionType,
): Promise<ProblemCollection[]> {
  const response = await fetch(`/api/problem-collections/type/${type}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }

  return response.json();
}

export async function getProblemCollection(
  collectionId: string,
): Promise<ProblemCollectionDetail | null> {
  const response = await fetch(`/api/problem-collections/${collectionId}`, {
    credentials: "include",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch collection");
  }

  return response.json();
}

export async function toggleProblemCompletion(
  problemId: string,
  completed: boolean,
) {
  const response = await fetch(`/api/problems/${problemId}/complete`, {
    method: completed ? "POST" : "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to toggle problem completion");
  }

  return response.json();
}
