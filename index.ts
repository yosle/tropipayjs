/**
 * Tropipayjs is a wrapper for the Tropipay API. It was made in
 * typescript but you can use Javascript.
 * @author Yosleivy baez Acosta
 * 
 */

import axios, { Axios } from "axios";
import { PaymentLink, PaymentLinkPayload } from './interfaces/paymentlink'


type ServerMode = 'Development' | 'Production'


class Tropipay {
    readonly client_id: string;
    readonly client_secret: string;
    public request: Axios;
    public access_token: string | undefined;
    public refresh_token: string | undefined;
    public server_mode: ServerMode;

    constructor(
        client_id: string,
        client_secret: string,
        server_mode: ServerMode = 'Development') {
        this.client_id = client_id;
        this.client_secret = client_secret
        this.server_mode = server_mode

        this.request = axios.create({
            baseURL: this.server_mode === 'Production'
                ? 'https://www.tropipay.com'
                : 'https://tropipay-dev.herokuapp.com',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${this.access_token}`,

            }   
        })
    }


    async login() {
        try {
            const { data } = await this.request.post<LoginResponse>('/api/v2/access/token', {
                client_id: this.client_id,
                client_secret: this.client_secret,
                grant_type: "client_credentials",
                scope: "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE KYC3_FULL_ALLOW ALLOW_PAYMENT_OUT ALLOW_MARKET_PURCHASES ALLOW_GET_BALANCE ALLOW_GET_MOVEMENT_LIST ALLOW_GET_CREDENTIAL "
            }, {
                // headers: {
                //     'Content-Type': 'application/json',
                //     Accept: 'application/json',
                // }
            })

            this.access_token = data.access_token
            this.refresh_token = data.refresh_token
            return data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // 👇️ error: AxiosError<any, any>
                throw new Error("Conection error: " + error.message);
            }
            throw new Error("Could not obtain the access token from credentials ");

        }
    }

    /**
     * Create a paymentLink width the specifued payload
     * @param payload Object of PaymentLinkPayload type with paylink payload
     * @returns Promise<PaymentLink> or Error
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    async createPayLink(payload: PaymentLinkPayload): Promise<PaymentLink> {
        if (!this.access_token) {
            await this.login()
        }
        try {
            const paylink = await this.request.post('/api/v2/paymentcards', payload, {
                headers: {
                    // 'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.access_token}`,
                    // Accept: 'application/json'
                }
            })
            return paylink.data as PaymentLink
        } catch (error) {
            throw new Error(`Error tryng to get the access token`);

        }
    }

    /**
     * Get all deposits in this account.
     * @returns A Promise of an Array of AccountDeposits or throws an Exception
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6OTgyOTQ1Mg-get-deposit-accounts-list
     */
    async getDepositAccounts(): Promise<AccountDeposits[] | Error>{
        if (!this.access_token) {
            await this.login()
        }
        try {
            const deposits  = await this.request.get('/api/v2/deposit_accounts',{            }) 
            return deposits.data
        } catch (error) {
            throw new Error(`Could not retrieve the account deposits ${error}`);    
        }
    }

    /**
     * Get the list of all supported countries by Tropipay.
     * @returns Array of Countries
     * @see 
     */
    async countries(): Promise<Country[] | Error>{
        if (!this.access_token) {
            await this.login()
        }
        try {
            const countries  = await this.request.get('/api/countries') 
            return countries.data 
        } catch (error) {
            throw new Error(`Could not retrieve the countries list`);    
        }
    }

    /**
     * Get list of all the favorites accounts. 
     * @returns 
     * @see
     */
    async favorites(){
        if (!this.access_token) {
            await this.login()
        }
        try {
            const favorites  = await this.request.get('/api/v2/paymentcards/favorites') 
            return favorites.data 
        } catch (error) {
            throw new Error(`Could not retrieve favorites list`);    
        }
    }

    /**
     * List all movements in current account. You can optionaly specify
     *  offset and limit params for pagination.
     * @returns 
     */
    async movements(offset = 0 , limit = 10){
        if (!this.access_token) {
            await this.login()
        }
        try {
            const movements  = await this.request.get('/api/v2/movements',
            {params: {limit: limit, offset: offset},
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${this.access_token}`,

            } }) 
            return movements.data 
        } catch (error) {
            throw new Error(`Could not retrieve movements list`);    
        }
   
    }

    /**
     * Return profile data for this account.
     * @returns 
     */
    async profile(){
        if (!this.access_token) {
            await this.login()
        }
        try {
            const profile  = await this.request.get('/api/users/profile') 
            return profile.data 
        } catch (error) {
            throw new Error(`Could not retrieve movements list ${error}`);    
        }
    }

    async getRates(payload = {currencyFrom: "EUR"}) {
        console.log(payload)
        if (!this.access_token) {
            await this.login()
        }
    try {
        const rates  = await this.request.post('/api/v2/movements/get_rate',{payload,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${this.access_token}`,

        } }) 
        return rates.data 
    } catch (error) {
        throw new Error(`Could not retrieve rates ${error}`);    
    }
        
    } 

}


export default Tropipay


