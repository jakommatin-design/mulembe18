import { geographyService } from "../services/geography.service";
import { apiSuccess, apiError } from "@/lib/api/response";
import { CountyCodeSchema } from "@/lib/schemas/geography";

export class GeographyController {
  async getCounties() {
    try {
      const counties = await geographyService.getCounties();
      return apiSuccess(counties);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to retrieve counties";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async getSubCounties(countyCode: string) {
    const parse = CountyCodeSchema.safeParse(countyCode);
    if (!parse.success) {
      return apiError(
        "INVALID_PARAMETER",
        "County code must be a 3-digit string (e.g., '037')",
        400,
        parse.error.errors.map((e) => ({ field: "code", message: e.message }))
      );
    }

    try {
      const subCounties = await geographyService.getSubCounties(countyCode);
      return apiSuccess(subCounties);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to retrieve sub-counties";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async getWards(subCountyId: string) {
    if (!subCountyId || typeof subCountyId !== "string") {
      return apiError("INVALID_PARAMETER", "Sub-county ID is required", 400);
    }

    try {
      const wards = await geographyService.getWards(subCountyId);
      return apiSuccess(wards);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to retrieve wards";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }
}

export const geographyController = new GeographyController();

