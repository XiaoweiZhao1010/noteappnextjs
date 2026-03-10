import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { sendError } from "@/lib/sendError";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return sendError(400, "Invalid JSON body");

  const { email, password } = body;
  if (!email || !password)
    return sendError(400, "Email and password are required");

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return sendError(400, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(400, "Invalid credentials");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return Response.json({ token });
  } catch (err) {
    console.error(err);
    return sendError();
  }
}
