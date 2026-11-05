import { memberController } from "@/server/controllers/member.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function POST() {
  const user = await getSessionUser();
  return await memberController.leaveChapter(user);
}

