import { memberController } from "@/server/controllers/member.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  const user = await getSessionUser();
  const url = new URL(req.url);
  return await memberController.listMembers(user, url);
}

