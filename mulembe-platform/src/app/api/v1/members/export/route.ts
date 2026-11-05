import { memberController } from "@/server/controllers/member.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  return await memberController.exportUserData(user);
}

