import { prisma } from "@/src/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function getToken(tokenHash: string) {
  return await prisma.verificationToken.findUnique({
    where: { tokenHash: tokenHash },
  });
}

export async function createToken(email: string, expiresAt: Date) {
  const tokenHash = crypto.randomUUID();
  await prisma.verificationToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
    },
  });
  return tokenHash;
}

export async function sendVerificationEmail(email: string, tokenHash: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifica tu cuenta",
    html: `
    <h2>Verifica tu cuenta</h2>
    <p>Haz click aquí:</p>
    <a href="https://licc-ramos.vercel.app/api/auth/verify?token=${tokenHash}">
      Verificar correo
    </a>
  `,
  });
}
