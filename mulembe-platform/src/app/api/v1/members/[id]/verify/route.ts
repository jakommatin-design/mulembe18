import { memberController } from "@/server/controllers/member.controller";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const user = await getSessionUser();
  const body = await req.json().catch(() => ({}));
  return await memberController.verifyMember(user, id, body);
}

