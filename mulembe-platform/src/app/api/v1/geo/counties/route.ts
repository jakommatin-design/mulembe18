import { geographyController } from "@/server/controllers/geography.controller";

export async function GET() {
  return await geographyController.getCounties();
}

