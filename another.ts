import Tropipay from '.'
import { PaymentLink, PaymentLinkPayload } from './interfaces/paymentlink';

const tpp = new Tropipay('5aca1638f7596bee9cb388e51d2ad58e',
'4a0150d3cec2036b9f24ec53f52e7c19')


const payload = {
    reference: "platano",
    concept: "Bicycle",
    favorite: true,
    description: "Platano burro",
    amount: 234,
    currency: "EUR",
    singleUse: true,
    reasonId: 4,
    expirationDays: 1,
    lang: "es",
    urlSuccess: "https://my-business.com/payment-ok",
    urlFailed: "https://my-business.com/payment-ko",
    urlNotification: "https://my-business.com/payment-callback",
    serviceDate: "2021-08-20",
    client: {
      name: "John",
      lastName: "McClane",
      address: "Ave. Guadí 232, Barcelona, Barcelona",
      phone: "+34645553333",
      email: "client@email.com",
      countryId: 1,
      termsAndConditions: true
    },
    directPayment: true,

  }
  
 const est = async () =>{
  //  //await tpp.login()
  //  const paylink = await tpp.createPayLink(payload)
  try {
    const rates = await tpp.createPayLink(payload)
    tpp.countries
    console.log(rates)
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
  }
 
  } ;
 

  est();