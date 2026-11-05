import { memberController } from "@/server/controllers/member.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(req: Request) {
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await memberController.registerMember(user, body);
}

