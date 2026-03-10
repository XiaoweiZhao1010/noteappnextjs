import jwt from "jsonwebtoken";
import { sendError } from "./sendError";

export function getUserIdFromRequest(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return { errorResponse: sendError(403, "No token provided") };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId };
  } catch {
    return { errorResponse: sendError(403, "Invalid or expired token") };
  }
}

