import { notificationController } from "@/server/controllers/notification.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(req: Request) {
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await notificationController.send(user, body);
}
