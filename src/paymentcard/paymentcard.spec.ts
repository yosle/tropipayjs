function sum(a: number, b: number) {
  return a + b;
}
describe("dummy test", () => {
  it("dummy test", (done) => {
    expect(sum(1, 2)).toBe(3);
    done();
  });
});
