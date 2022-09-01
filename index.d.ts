import { Axios, AxiosError } from "axios";
declare class Tropipay {
    readonly client_id: string;
    readonly client_secret: string;
    readonly enviroment: string;
    request: Axios;
    private access_token;
    private refresh_token;
    constructor(c_id: string, c_secret: string, env?: string);
    login(): Promise<AxiosError<unknown, any> | "An unexpected error occurred" | undefined>;
    /**
     * Create a paymentlink
     * @returns PaymentLink Object or AxiosError
     */
    createPayLink(): Promise<AxiosError<unknown, any> | undefined>;
}
export default Tropipay;
