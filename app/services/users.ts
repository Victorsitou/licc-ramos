type UpdateUserDto = {
  name?: string;
  email?: string;
  courses?: string[];
};

export function updateUser(data: UpdateUserDto) {
  return fetch("/api/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
