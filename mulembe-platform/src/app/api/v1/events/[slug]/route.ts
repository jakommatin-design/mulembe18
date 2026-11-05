import { eventController } from "@/server/controllers/event.controller";

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  return await eventController.getEventBySlug(slug);
}

