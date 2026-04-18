import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { createResourceSchema } from "../dtos/create-resource.dto";
import {
  createResource,
  getClassesResources,
  getUserResources,
} from "./resources.service";
import { getUserById } from "../users/users.service";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsed = createResourceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const resource = await createResource(parsed.data);
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET(_: Request) {
  try {
    const userJWt = await getCurrentUser();

    let resources;
    if (!userJWt?.sub) {
      // If the user is not logged in, then return only the classes.
      resources = await getClassesResources();
    } else {
      const user = await getUserById(userJWt.sub);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Verifies whether the user if verified,
      // if so, then return all resources with the completed status
      // if not, then only return the classes.
      if (user.verified) {
        resources = await getUserResources(user.id);
      } else {
        resources = await getClassesResources();
      }
    }
    return NextResponse.json(resources);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 },
    );
  }
}
