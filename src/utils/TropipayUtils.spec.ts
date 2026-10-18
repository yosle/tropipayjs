import { ServerSideUtils } from "./TropipayUtils";

const toBase64 = (bytes: number[], mime: string) =>
  `data:${mime};base64,` + Buffer.from(bytes).toString("base64");

function png(width: number, height: number) {
  const buffer = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return toBase64([...buffer], "image/png");
}

// SOF0 frame header: marker, length 17, precision 8, height, width
const sof0 = (width: number, height: number) => [
  0xff, 0xc0, 0x00, 0x11, 0x08,
  height >> 8, height & 0xff,
  width >> 8, width & 0xff,
  0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
];

describe("ServerSideUtils.getImageDimensions", () => {
  it("reads PNG dimensions", () => {
    expect(ServerSideUtils.getImageDimensions(png(300, 200))).toEqual({
      width: 300,
      height: 200,
    });
  });

  it("reads JPEG dimensions after an APP0 segment", () => {
    const app0 = [0xff, 0xe0, 0x00, 0x04, 0x4a, 0x46];
    const jpeg = toBase64([0xff, 0xd8, ...app0, ...sof0(640, 480)], "image/jpeg");

    expect(ServerSideUtils.getImageDimensions(jpeg)).toEqual({
      width: 640,
      height: 480,
    });
  });

  it("skips fill bytes and standalone markers before the frame header", () => {
    const jpeg = toBase64(
      [0xff, 0xd8, 0xff, 0xff, 0xd0, ...sof0(128, 128)],
      "image/jpeg"
    );

    expect(ServerSideUtils.getImageDimensions(jpeg)).toEqual({
      width: 128,
      height: 128,
    });
  });

  it("rejects unsupported formats", () => {
    expect(() =>
      ServerSideUtils.getImageDimensions(toBase64([0x47, 0x49, 0x46], "image/gif"))
    ).toThrow("Unsupported image format");
  });
});

describe("ServerSideUtils.isBase64ImageSquare", () => {
  it("detects square and non-square images", async () => {
    await expect(ServerSideUtils.isBase64ImageSquare(png(64, 64))).resolves.toBe(
      true
    );
    await expect(ServerSideUtils.isBase64ImageSquare(png(64, 32))).resolves.toBe(
      false
    );
  });
});
