import { geographyRepository } from "../repositories/geography.repository";

export class GeographyService {
  async getCounties() {
    return await geographyRepository.getAllCounties();
  }

  async getCounty(code: string) {
    return await geographyRepository.getCountyByCode(code);
  }

  async getSubCounties(countyCode: string) {
    return await geographyRepository.getSubCountiesByCounty(countyCode);
  }

  async getWards(subCountyId: string) {
    return await geographyRepository.getWardsBySubCounty(subCountyId);
  }
}

export const geographyService = new GeographyService();

