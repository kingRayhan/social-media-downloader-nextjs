import path from "path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import z from "zod";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  // accept body
  const body = await request.json();

  try {
    // validate body with zod
    const schema = z.object({ url: z.string().url() });
    const _body = schema.parse(body, {});

    // download content locally

    const fileName = crypto.randomUUID();

    const cliPath = path.resolve(__dirname, `../../../../../cli/yt-dlp.cli`);
    const downloadPath = path.resolve(__dirname, `../../../../../downloads`);
    const download = await promisify(exec)(
      `${cliPath} -o "downloads/${fileName}.mp4" -f "bestvideo[ext=mp4]" ${_body.url}`
    );

    const match = download.stdout.match(/Destination: (.+)/);
    const downloadedFile = match && match[1].trim();

    console.log({ downloadedFile });

    // upload content to s3
    const command = new PutObjectCommand({
      Bucket: "social-media-downloader-test-return0",
      Body: await fs.readFile(downloadedFile!),
      Key: `${fileName}.mp4`,
    });

    // response s3 url
    await s3Client.send(command);

    // const getObjectCommand = s3Client.
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: "social-media-downloader-test-return0",
        Key: `${fileName}.mp4`,
      }),
      { expiresIn: 100 }
    );

    const response = {
      downloadUrl: signedUrl,
    };
    await fs.unlink(downloadedFile!);
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error }, { status: 400 });
  }
}
