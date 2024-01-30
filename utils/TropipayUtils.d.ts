import { Tropipay } from "../api/TropipayAPI";
export declare class ServerSideUtils {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    /**
     * Verify Topipay's signature on webhooks.
     * @param credentials Credential object or Tropipay instance
     * @param {String} originalCurrencyAmount
     * @param bankOrderCode
     * @param signature
     * @returns {Boolean}
     */
    static verifySignature(credentials: {
        clientId: string;
        clientSecret: string;
    } | Tropipay, originalCurrencyAmount: string, bankOrderCode: string, signature: string): boolean;
    /**
     * Checks if the provided base64 string represents a square image.
     *
     * @param {string} base64String - The base64 string of the image
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the image is square
     */
    static isBase64ImageSquare(base64String: string): Promise<boolean>;
    /**
     * Takes a local file path and returns a base64 representation of the file content.
     *
     * @param {string} filepath - the path of the file to be converted to base64
     * @return {Promise<string>} a Promise that resolves to the base64 representation of the file content
     */
    static fileToBase64(filepath: string): Promise<string>;
    /**
     * Get the base64 representation of a remote file from the given URL.
     *
     * @param {string} url - the URL of the file
     * @return {Promise<string>} the base64 representation of the file
     */
    static getBase64FromFileUrl(url: string): Promise<string>;
    /**
     * Check if the base64 string represents a valid image and has a valid size
     *
     * @param {string} base64Image - the base64 image to be validated
     * @return {Promise<string>} the valid base64 image
     */
    static isValidImage(base64Image: string): boolean;
}
