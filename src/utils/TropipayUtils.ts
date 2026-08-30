import * as crypto from "crypto";
import { Tropipay } from "../api/TropipayAPI";

import axios from "axios";
import fs from "fs/promises";
import { MAX_IMAGE_SIZE_MB } from "../constants/TropipayConstants";
export class ServerSideUtils {
  private tropipay: Tropipay;
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  /**
   * Verify Topipay's signature on webhooks.
   * @param credentials Credential object or Tropipay instance
   * @param {String} originalCurrencyAmount
   * @param bankOrderCode
   * @param signature
   * @returns {Boolean}
   */
  public static verifySignature(
    credentials:
      | {
          clientId: string;
          clientSecret: string;
        }
      | Tropipay,
    originalCurrencyAmount: string,
    bankOrderCode: string,
    signature: string
  ): boolean {
    const localSignature = crypto
      .createHash("sha256")
      .update(
        bankOrderCode +
          credentials.clientId +
          credentials.clientSecret +
          originalCurrencyAmount
      )
      .digest("hex");
    return localSignature === signature;
  }
  /**
   * Checks if the provided base64 string represents a square image.
   * Supports PNG and JPEG images (dimensions are read directly from
   * the binary header, no DOM required).
   *
   * @param {string} base64String - The base64 string of the image
   * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the image is square
   */
  public static async isBase64ImageSquare(
    base64String: string
  ): Promise<boolean> {
    const dimensions = ServerSideUtils.getImageDimensions(base64String);
    return dimensions.width === dimensions.height;
  }

  /**
   * Reads the width/height of a base64 encoded PNG or JPEG image
   * from its binary header.
   *
   * @param {string} base64String - base64 image, with or without the data: prefix
   * @return {{width: number, height: number}} the image dimensions
   */
  public static getImageDimensions(base64String: string): {
    width: number;
    height: number;
  } {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // PNG signature: 89 50 4E 47, IHDR width/height at offsets 16/20
    if (
      buffer.length > 24 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      };
    }

    // JPEG signature: FF D8. Scan segments for a SOFn marker with the frame size.
    if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < buffer.length) {
        if (buffer[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        // SOF0-SOF15 markers except DHT (C4), JPG (C8) and DAC (CC)
        if (
          marker >= 0xc0 &&
          marker <= 0xcf &&
          marker !== 0xc4 &&
          marker !== 0xc8 &&
          marker !== 0xcc
        ) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        offset += 2 + buffer.readUInt16BE(offset + 2);
      }
    }

    throw new Error("Unsupported image format: only PNG and JPEG are allowed");
  }

  /**
   * Takes a local file path and returns a base64 representation of the file content.
   *
   * @param {string} filepath - the path of the file to be converted to base64
   * @return {Promise<string>} a Promise that resolves to the base64 representation of the file content
   */
  public static async fileToBase64(filepath: string): Promise<string> {
    const contents = await fs.readFile(filepath);
    let base64content = contents.toString("base64");
    const ext = filepath.split(".").pop();
    return `data:image/${ext};base64,` + base64content;
  }

  /**
   * Get the base64 representation of a remote file from the given URL.
   *
   * @param {string} url - the URL of the file
   * @return {Promise<string>} the base64 representation of the file
   */
  public static async getBase64FromFileUrl(url: string): Promise<string> {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      maxRedirects: 5,
    });
    return Buffer.from(response.data, "binary").toString("base64");
  }

  /**
   * Check if the base64 string represents a valid image and has a valid size
   *
   * @param {string} base64Image - the base64 image to be validated
   * @return {Promise<string>} the valid base64 image
   */
  public static isValidImage(base64Image: string): boolean {
    // Check if the base64 string represents a valid image and has a valid size
    try {
      const isBase64Image = base64Image.startsWith("data:image/");
      if (!isBase64Image) {
        console.error("Not a valid base64 image");
        throw new Error("Not a valid base64 image");
      }

      const isSizeValid =
        base64Image.length * 0.75 <= MAX_IMAGE_SIZE_MB * 1024 * 1024;

      if (!isSizeValid) {
        console.error(`The image should be less than ${MAX_IMAGE_SIZE_MB}mb`);
        throw new Error(`The image should be less than ${MAX_IMAGE_SIZE_MB}mb`);
      }
      // all is fine
      return true;
    } catch (error) {
      console.error("Error checking base64 image:", error);
      throw new Error(`Error checking base64 image`);
    }
  }
}
