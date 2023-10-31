import { AxiosError } from "axios";
export interface ErrorDetail {
    param: string;
    value: string | number | null;
    msg: string;
    code: string;
    location: string | null;
    meta: unknown;
}
export declare function handleExceptions(error: AxiosError | Error): TropipayJSException;
declare class TropipayJSException extends Error {
    code: number;
    error: unknown;
    message: string;
    constructor(message: string, code: number, data: unknown);
}
export {};
