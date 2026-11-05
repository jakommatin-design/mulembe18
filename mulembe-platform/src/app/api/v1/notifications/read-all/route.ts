import { notificationController } from "@/server/controllers/notification.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function PUT() {
  const user = await getSessionUser();
  return await notificationController.markAllAsRead(user);
}

