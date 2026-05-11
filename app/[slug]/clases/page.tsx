"use client";

import { useParams, useRouter } from "next/navigation";

export default function ClasesPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  if (typeof slug !== "string") {
    return router.push("/");
  }
  return router.push(`/${params.slug}`);
}
