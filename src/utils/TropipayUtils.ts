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
   *
   * @param {string} base64String - The base64 string of the image
   * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the image is square
   */
  public static async isBase64ImageSquare(
    base64String: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // Check if the image has a 1:1 aspect ratio
        const isSquare = img.width === img.height;
        resolve(isSquare);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = base64String;
    });
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

      // TODO: use constants intead of magic numbers here
      const isSizeLessThan2MB =
        base64Image.length * 0.75 <= MAX_IMAGE_SIZE_MB * 1024 * 1024;

      if (!isSizeLessThan2MB) {
        console.error(`The image should be less than 2mb`);
        throw new Error(`The image should be less than 2mb`);
      }
      // all is fine
      return true;
    } catch (error) {
      console.error("Error checking base64 image:", error);
      throw new Error(`Error checking base64 image`);
    }
  }
}
