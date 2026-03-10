import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { prisma } from "@/lib/prisma";
import { sendError } from "@/lib/sendError";

const registrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
});

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return sendError(400, "Invalid JSON body");

  const { email, password } = body;
  const { error } = registrationSchema.validate({ email, password });
  if (error) return sendError(400, error.details[0].message);

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return sendError(400, "User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true },
    });

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({ token });
  } catch (err) {
    console.error(err);
    return sendError();
  }
}

