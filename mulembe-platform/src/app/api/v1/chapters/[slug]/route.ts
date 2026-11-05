import { chapterController } from "@/server/controllers/chapter.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  return await chapterController.getChapterBySlug(slug);
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  // 'slug' in this path can act as id or slug
  return await chapterController.updateChapter(user, slug, body);
}

