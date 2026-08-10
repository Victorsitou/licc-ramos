export async function authedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  retried = false,
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401 && !retried) {
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    if (refreshResponse.ok) {
      return authedFetch(input, init, true);
    }
  }

  return response;
}
