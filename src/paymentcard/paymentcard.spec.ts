import { describe, expect, it } from "vitest";

function sum(a: number, b: number) {
  return a + b;
}
describe("dummy test", () => {
  it("dummy test", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
