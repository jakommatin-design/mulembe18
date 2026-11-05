import { notificationController } from "@/server/controllers/notification.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  const user = await getSessionUser();
  const url = new URL(req.url);
  return await notificationController.list(user, url.searchParams);
}

