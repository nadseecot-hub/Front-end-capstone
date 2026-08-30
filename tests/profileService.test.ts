import { describe, expect, it } from "vitest";
import { calculateProfileCompleteness } from "@/services/profileService";

const requiredProfile = {
  name: "Alex Johnson",
  subjects: "Mathematics",
};

describe("calculateProfileCompleteness", () => {
  it("returns 60% for a required basic tutor profile", () => {
    expect(calculateProfileCompleteness(requiredProfile)).toBe(60);
  });

  it("returns 85% after adding an hourly rate and profile picture", () => {
    expect(
      calculateProfileCompleteness({
        ...requiredProfile,
        hourlyRate: 35,
        photoURL: "https://example.com/alex.jpg",
      }),
    ).toBe(85);
  });

  it("returns 100% after adding experience", () => {
    expect(
      calculateProfileCompleteness({
        ...requiredProfile,
        hourlyRate: 35,
        photoURL: "https://example.com/alex.jpg",
        experience: "Five years teaching mathematics",
      }),
    ).toBe(100);
  });
});
