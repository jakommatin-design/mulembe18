import { geographyController } from "@/server/controllers/geography.controller";

export async function GET(
  _req: Request,
  props: { params: Promise<{ code: string }> }
) {
  const { code } = await props.params;
  return await geographyController.getSubCounties(code);
}

