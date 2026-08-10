import { authedFetch } from "./api";

type UpdateUserDto = {
  name?: string;
  email?: string;
  courses?: string[];
};

export function updateUser(data: UpdateUserDto) {
  return authedFetch("/api/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
