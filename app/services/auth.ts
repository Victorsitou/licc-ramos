export function login(email: string, password: string) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
}

export function logout() {
  return fetch("/api/auth/logout", {
    method: "POST",
  });
}
