import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { r2 } from "@/src/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { uploadFileSchema } from "../../dtos/upload-file.dto";

import { createResource } from "../resources.service";

import { withAdmin } from "../../wrappers/withAdmin";

// TODO: use FormData
export const POST = withAdmin(async (request) => {
  try {
    const body = await request.json();

    const parsed = uploadFileSchema.parse(body);

    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(parsed.content, "base64");
    const uploadParams = {
      Bucket: process.env.R2_BUCKET,
      Key: parsed.resourceData.key,
      Body: buffer,
      ContentType: "application/pdf",
    };

    const result = await r2.send(new PutObjectCommand(uploadParams));

    if (result.$metadata.httpStatusCode !== 200) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );
    }

    const resource = await createResource(parsed.resourceData);
    if (parsed.resourceData.type === "WORKSHOP") {
      revalidateTag(`resources-WORKSHOP`, "max");
    } else {
      revalidateTag(
        `resources-${parsed.resourceData.type}-${parsed.resourceData.slug}`,
        "max",
      );
    }
    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
});
