import { NextRequest, NextResponse } from "next/server";
import { casServiceValidate } from "@/app/api/dtos/cas-service-validate.dto";
import { getUserByEmailUser } from "../../../users/users.service";
import { generateToken } from "./reset-password.service";

function getServiceURL(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}/api/auth/reset-password/cas`;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const ticket = searchParams.get("ticket");
  const serviceURL = getServiceURL(req);

  if (ticket) {
    const response = await fetch(
      `${process.env.VALIDATE_URL}?service=${serviceURL}&ticket=${ticket}&format=json`,
    );

    if (response.ok) {
      const data = await response.json();
      const parseResult = casServiceValidate.safeParse(data);
      if (!parseResult.success) {
        console.error("Error parsing data:", parseResult.error);
        return new NextResponse("Error parsing data", { status: 500 });
      }
      const emailUser =
        parseResult.data.serviceResponse.authenticationSuccess.user;

      const user = await getUserByEmailUser(emailUser);
      if (!user) {
        console.error("User not found:", emailUser);
        return new NextResponse("User not found", { status: 404 });
      }

      const token = await generateToken(user.id);
      return NextResponse.redirect(
        new URL(`/reset-password?token=${token}`, serviceURL),
      );
    } else {
      console.error("Error fetching data:", response.statusText);
      return new Response("Error fetching data", { status: 500 });
    }
  } else {
    return new NextResponse("Ticket is required", { status: 400 });
  }
}
