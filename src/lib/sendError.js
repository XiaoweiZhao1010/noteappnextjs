import { NextResponse } from "next/server";

export function sendError(statusCode = 500, message = "Server error") {
  return NextResponse.json({ error: message }, { status: statusCode });
}

