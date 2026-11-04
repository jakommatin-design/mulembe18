import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Tooling & Environment Setup", () => {
  it("validates that Zod schema validation functions as expected", () => {
    const KenyaCountySchema = z.object({
      code: z.string().length(3),
      name: z.string().min(1),
    });

    const result = KenyaCountySchema.safeParse({ code: "037", name: "Kakamega" });
    expect(result.success).toBe(true);
  });
});
