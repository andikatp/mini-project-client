import { describe, expect, it } from "bun:test";

describe("Sanity Check", () => {
  it("should pass standard mathematical assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("should verify string formatting correctly", () => {
    const appName = "EventMgmt Client";
    expect(appName).toContain("EventMgmt");
  });
});
