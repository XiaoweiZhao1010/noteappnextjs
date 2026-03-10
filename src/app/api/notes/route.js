import Joi from "joi";
import { prisma } from "@/lib/prisma";
import { sendError } from "@/lib/sendError";
import { getUserIdFromRequest } from "@/lib/verifyToken";

const noteSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  content: Joi.string().required().messages({
    "string.empty": "Content is required",
  }),
  tag: Joi.string().optional().allow(""),
});

export async function GET(request) {
  const auth = getUserIdFromRequest(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const notes = await prisma.note.findMany({
      where: { userId: auth.userId },
      orderBy: { id: "desc" },
    });
    return Response.json(notes);
  } catch (err) {
    console.error(err);
    return sendError();
  }
}

export async function POST(request) {
  const auth = getUserIdFromRequest(request);
  if (auth.errorResponse) return auth.errorResponse;

  const body = await request.json().catch(() => null);
  if (!body) return sendError(400, "Invalid JSON body");

  const { error } = noteSchema.validate(body);
  if (error) return sendError(400, error.details[0].message);

  const { title, content, tag } = body;
  try {
    const newNote = await prisma.note.create({
      data: { title, content, tag: tag ?? "", userId: auth.userId },
    });
    return Response.json(newNote, { status: 201 });
  } catch (err) {
    console.error(err);
    return sendError();
  }
}

