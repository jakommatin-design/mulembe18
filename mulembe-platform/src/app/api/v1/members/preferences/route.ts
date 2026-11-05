import { notificationController } from "@/server/controllers/notification.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  return await notificationController.getPreferences(user);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await notificationController.updatePreferences(user, body);
}

