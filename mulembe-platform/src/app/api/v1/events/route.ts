import { eventController } from "@/server/controllers/event.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  return await eventController.listEvents(url);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await eventController.createEvent(user, body);
}
