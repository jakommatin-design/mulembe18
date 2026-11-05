import { chapterController } from "@/server/controllers/chapter.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  return await chapterController.listChapters(url);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await chapterController.createChapter(user, body);
}

