// Single-flight refresh: concurrent 401s share one rotation call instead of
// each firing /api/auth/refresh with the same single-use token (which would
// race and fail all but the first).
let refreshPromise: Promise<boolean> | null = null;

function refreshTokens(): Promise<boolean> {
  refreshPromise ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function authedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  retried = false,
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401 && !retried) {
    const refreshed = await refreshTokens();

    if (refreshed) {
      return authedFetch(input, init, true);
    }
  }

  return response;
}
