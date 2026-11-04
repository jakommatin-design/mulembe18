import { db } from "@/lib/db";
import { counties, subCounties, wards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class GeographyRepository {
  async getAllCounties() {
    return await db.select().from(counties).orderBy(counties.code);
  }

  async getCountyByCode(code: string) {
    const result = await db.select().from(counties).where(eq(counties.code, code));
    return result[0] || null;
  }

  async getSubCountiesByCounty(countyCode: string) {
    return await db
      .select()
      .from(subCounties)
      .where(eq(subCounties.countyCode, countyCode))
      .orderBy(subCounties.name);
  }

  async getWardsBySubCounty(subCountyId: string) {
    return await db
      .select()
      .from(wards)
      .where(eq(wards.subCountyId, subCountyId))
      .orderBy(wards.name);
  }
}

export const geographyRepository = new GeographyRepository();

