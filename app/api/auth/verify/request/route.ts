import { getCurrentUser } from "@/src/lib/auth";
import { getUserById } from "@/app/api/users/users.service";
import { createToken, sendVerificationEmail } from "../verify.service";

export async function POST() {
  try {
    const userJwt = await getCurrentUser();

    if (!userJwt?.sub) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUserById(userJwt.sub);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    if (user.verified) {
      return new Response("User already verified", { status: 400 });
    }

    const verificationToken = await createToken(
      user.email,
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    );
    await sendVerificationEmail(user.email, verificationToken);
    return new Response("Verification email sent", { status: 200 });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
