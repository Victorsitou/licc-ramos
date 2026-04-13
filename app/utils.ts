export function stringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(dateString: string): string {
  const date = stringToDate(dateString);
  return date.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = stringToDate(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function getUser(): Promise<User | null> {
  // TODO: cache this?
  return fetch("/api/auth/me")
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        return null;
      }
      return data;
    });
}
