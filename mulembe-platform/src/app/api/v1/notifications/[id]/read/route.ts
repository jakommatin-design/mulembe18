import { notificationController } from "@/server/controllers/notification.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  const { id } = await params;
  return await notificationController.markAsRead(user, id);
}

