import { announcementController } from "@/server/controllers/announcement.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const user = await getSessionUser();
  return await announcementController.deleteAnnouncement(user, id);
}

