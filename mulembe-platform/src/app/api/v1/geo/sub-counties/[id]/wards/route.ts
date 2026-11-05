import { geographyController } from "@/server/controllers/geography.controller";

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  return await geographyController.getWards(id);
}

