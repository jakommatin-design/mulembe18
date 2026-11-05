import { eventController } from "@/server/controllers/event.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await eventController.rsvp(user, id, body);
}
