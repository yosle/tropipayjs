import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import {PaymentLink,PaymentLinkPayload} from './interfaces/paymentlink'
 type LoginResponse  = {
    access_token: string,
    refresh_token: string
    token_type: "Bearer",
    expires_in: number,
    scope: string
} 

type LoginError =  {
    error: string
}


class Tropipay {
   readonly client_id: string;
   readonly client_secret: string;
   readonly enviroment: string
   public request: Axios
   private access_token: string | undefined
   private refresh_token: string | undefined

    constructor(
        c_id: string,
        c_secret:string,
        env: string='development') {
            this.client_id = c_id;
            this.client_secret = c_secret
            this.enviroment = env

        this.request = axios.create({
                baseURL: this.enviroment === 'production' 
                            ? 'https://www.tropipay.com'
                            : 'https://tropipay-dev.herokuapp.com',
                            })
    }

 
    async login() {
       try {
        const {data} = await this.request.post<LoginResponse>('/api/v2/access/token',{
            client_id: this.client_id,
            client_secret: this.client_secret,
            grant_type: "client_credentials",
            scope: "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE"
        },{
            headers:{
                'Content-Type': 'application/json',
                  Accept: 'application/json',
            }
        })        
        
        this.access_token = data.access_token
        this.refresh_token = data.refresh_token
        return data
        } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            // 👇️ error: AxiosError<any, any>
            throw new Error("Conection error: " + error.message);            
          }

    }


        }
    async createPayLink(payload: PaymentLinkPayload) {
            if (this.access_token == undefined){
                await this.login()
               }         
            try {
                const paylink = await this.request.post('/api/v2/paymentcards',payload,{
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.access_token}`,
                    Accept: 'application/json'
                    }         
                }) 
                return paylink.data as PaymentLink 
            } catch (error) {
                throw new Error(`Error` );
                               
           }
        }     

    }



export default Tropipay


