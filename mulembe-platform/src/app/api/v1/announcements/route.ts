import { announcementController } from "@/server/controllers/announcement.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  return await announcementController.listAnnouncements(url);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await announcementController.createAnnouncement(user, body);
}
