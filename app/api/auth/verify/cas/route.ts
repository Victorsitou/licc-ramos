import { NextRequest, NextResponse } from "next/server";
import { getUserByEmailUser, verifyUser } from "@/app/api/users/users.service";
import { z } from "zod";

const serviceValidate = z.object({
  serviceResponse: z.object({
    authenticationSuccess: z.object({
      user: z.string(),
      attributes: z.object({
        credentialType: z.array(z.string()),
        clientIpAddress: z.array(z.string()),
        samlAuthenticationStatementAuthMethod: z.array(z.string()),
        isFromNewLogin: z.array(z.boolean()),
        authenticationDate: z.array(z.number()),
        authenticationMethod: z.array(z.string()),
        successfulAuthenticationHandlers: z.array(z.string()),
        serverIpAddress: z.array(z.string()),
        userAgent: z.array(z.string()),
        longTermAuthenticationRequestTokenUsed: z.array(z.boolean()),
      }),
    }),
  }),
});

function getServiceURL(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}/api/auth/verify/cas`;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const ticket = searchParams.get("ticket");
  const serviceURL = getServiceURL(req);

  if (ticket) {
    const response = await fetch(
      `${process.env.VALIDATE_URL}?service=${serviceURL}&ticket=${ticket}&format=json`,
      { method: "GET" },
    );

    if (response.ok) {
      const data = await response.json();
      // TODO: esto es muy dependiente a que no cambie
      const parseResult = serviceValidate.safeParse(data);
      if (!parseResult.success) {
        console.error("Error parsing data:", parseResult.error);
        // TODO: ir a / con info de error para mostrarle al usuario
        return new Response("Error parsing data", { status: 500 });
      }
      const emailUser =
        parseResult.data.serviceResponse.authenticationSuccess.user;

      const user = await getUserByEmailUser(emailUser);
      if (!user) {
        console.error("User not found:", emailUser);
        return new Response("User not found", { status: 404 });
      }

      await verifyUser(user.id);
      return NextResponse.redirect(new URL("/", serviceURL));
    } else {
      console.error("Error fetching data:", response.statusText);
      return new Response("Error fetching data", { status: 500 });
    }
  }
}
