import { memberController } from "@/server/controllers/member.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  return await memberController.getProfile(user);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await memberController.updateProfile(user, body);
}

