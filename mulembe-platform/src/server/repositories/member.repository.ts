import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export class MemberRepository {
  async getById(id: string) {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));
    return result[0] || null;
  }

  async getByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)));
    return result[0] || null;
  }

  async getByPhone(phone: string) {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.phone, phone), isNull(users.deletedAt)));
    return result[0] || null;
  }
}

export const memberRepository = new MemberRepository();

