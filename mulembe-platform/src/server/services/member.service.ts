import {
  memberRepository,
  RegisterMemberInput,
  UpdateProfileInput,
} from "../repositories/member.repository";
import { AuthUser, assertScopeAccess } from "@/lib/auth/roles";
import { auditRepository } from "../repositories/audit.repository";

export class MemberService {
  async getProfile(actor: AuthUser) {
    return await memberRepository.getById(actor.id);
  }

  async registerMember(actor: AuthUser, input: Omit<RegisterMemberInput, "userId">) {
    const updated = await memberRepository.registerMember({
      ...input,
      userId: actor.id,
    });

    await auditRepository.log({
      actorId: actor.id,
      action: "member.registered",
      targetEntity: "user",
      targetId: actor.id,
      payloadAfter: {
        membershipId: updated?.membershipId,
        ancestralCounty: input.ancestralCountyCode,
      },
    });

    return updated;
  }

  async updateProfile(actor: AuthUser, input: UpdateProfileInput) {
    return await memberRepository.updateProfile(actor.id, input);
  }

  async listMembers(
    actor: AuthUser,
    filters: { countyCode?: string; status?: string; clan?: string; page?: number; limit?: number }
  ) {
    // Check permission to view roster
    assertScopeAccess(actor, "view_roster", {
      countyCode: filters.countyCode || actor.countyCode,
      chapterId: actor.chapterId,
    });

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    // Enforce coordinator/chapter boundary if not national
    const effectiveCounty =
      actor.role === "county_coordinator" ? actor.countyCode : filters.countyCode;

    const { items, total } = await memberRepository.listScoped({
      countyCode: effectiveCounty,
      status: filters.status,
      clan: filters.clan,
      limit,
      offset,
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async verifyMember(actor: AuthUser, targetUserId: string, status: "active" | "suspended") {
    const target = await memberRepository.getById(targetUserId);
    if (!target) throw new Error("Member not found");

    assertScopeAccess(actor, "approve_members", {
      countyCode: target.currentCountyCode,
    });

    const updated = await memberRepository.verifyMember(targetUserId, status);

    await auditRepository.log({
      actorId: actor.id,
      action: `member.${status}`,
      targetEntity: "user",
      targetId: targetUserId,
      payloadBefore: { status: target.status },
      payloadAfter: { status },
    });

    return updated;
  }
}

export const memberService = new MemberService();

