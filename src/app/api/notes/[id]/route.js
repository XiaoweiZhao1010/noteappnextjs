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

export async function PUT(request, { params }) {
  const auth = getUserIdFromRequest(request);
  if (auth.errorResponse) return auth.errorResponse;

  const body = await request.json().catch(() => null);
  if (!body) return sendError(400, "Invalid JSON body");

  const { error } = noteSchema.validate(body);
  if (error) return sendError(400, error.details[0].message);

  const { title, content, tag } = body;
  const resolvedParams = await params;
  const noteId = Number(resolvedParams?.id);
  if (!Number.isInteger(noteId)) return sendError(400, "Invalid note id");

  try {
    const updated = await prisma.note.updateMany({
      where: { id: noteId, userId: auth.userId },
      data: { title, content, tag: tag ?? "" },
    });

    if (updated.count === 0) return sendError(404, "Note not found");

    const note = await prisma.note.findFirst({
      where: { id: noteId, userId: auth.userId },
    });
    return Response.json(note);
  } catch (err) {
    console.error(err);
    return sendError();
  }
}

export async function DELETE(request, { params }) {
  const auth = getUserIdFromRequest(request);
  if (auth.errorResponse) return auth.errorResponse;

  const resolvedParams = await params;
  const noteId = Number(resolvedParams?.id);
  if (!Number.isInteger(noteId)) return sendError(400, "Invalid note id");

  try {
    const deleted = await prisma.note.deleteMany({
      where: { id: noteId, userId: auth.userId },
    });

    if (deleted.count === 0) return sendError(404, "Note not found");

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return sendError();
  }
}

