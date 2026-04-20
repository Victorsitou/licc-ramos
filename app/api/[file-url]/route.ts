import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/src/lib/r2";
import { withVerified } from "../wrappers/withVerified";

export const GET = withVerified(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return new Response("Forbidden", { status: 403 });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(r2, command, {
    expiresIn: 60 * 15,
  });

  return Response.json({ url });
});
