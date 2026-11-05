import { eventController } from "@/server/controllers/event.controller";

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  return await eventController.getEventBySlug(id);
}
