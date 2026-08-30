# TropipayJS - Typescript/Javascript SDK for Tropipay Payments API

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![RollupJS](https://img.shields.io/badge/RollupJS-ef3335?style=for-the-badge&logo=rollup.js&logoColor=white)

<p align="center">
<a href="https://yosle.github.io/tropipayjs-docs">Explore the TropipayJS Documentation</a>
</p>

TropiPay is an electronic wallet that allows you to execute the most common financial operations of the day to day. This is SDK for Typescript and Javacript that helps you build integrations with the Tropipay platform in an easier way. Can save you a lot of time and effort implementing all the API features. You can use this library with CommonJS system (node + express) or ES6 module system (NextJS).

# Table of Contents

- [TropipayJS - Typescript/Javascript SDK for Tropipay Payments API](#tropipayjs---typescriptjavascript-sdk-for-tropipay-payments-api)
- [Table of Contents](#table-of-contents)
  - [About the project](#about-the-project)
- [Getting started](#getting-started)
  - [Setting up your app credentials](#setting-up-your-app-credentials)
  - [Usage](#usage)
    - [CommonJS](#commonjs)
    - [ES6](#es6)
    - [Initialize the Tropipay class](#initialize-the-tropipay-class)
    - [Generating a Payment Link](#generating-a-payment-link)
- [Contributing](#contributing)
- [License](#license)

## About the project

> **Version 0.3.0**: the SDK now targets Tropipay **API v3** (API v2 is
> deprecated). All endpoints were migrated; see the
> [CHANGELOG](CHANGELOG.md) for the full route mapping and breaking changes.

This library is a community effort. Tropipay may make some changes on the API specification. Use the [test environment](https://tropipay-dev.herokuapp.com) to make sure everything is working as expected.

**Note:** This library is provided as-is and serves as a client for the Tropipay API. While every effort has been made to ensure the accuracy and reliability of the library, Tropipay is solely responsible for maintaining and updating the API documentation.

The library is intended to simplify the integration process with Tropipay's services, but it is essential to consult the official documentation to ensure that you are using the API correctly and taking into account any recent changes or updates made by Tropipay.

# Getting started

You can use npm or yarn to install this package:

`npm install @yosle/tropipayjs`

or

`yarn add @yosle/tropipayjs`

## Setting up your app credentials

![alt](https://yosle.github.io/tropipayjs-docs/images/cred2.png)
![alt](https://yosle.github.io/tropipayjs-docs/images/cred3.png)

In order to use the Tropipay API you'll need a client ID and a client secret. Sign up with your [Tropipay](www.tropipay.com) account, go to the App Menu->Applications and credentials. You'll be asked to enter a confirmation code (use 123456 in the test enviroment). _Make sure you test everything in the [test environment](https://tropipay-dev.herokuapp.com) first before using your real account._ Create an app and configure the client id an client secret for the app.

## Usage

The Tropipay instance, allows you to access all the method available in the API. This Object is meant to be used _only in server side_. Do not use the Tropipay object on the client side (browser). This would expose your app credentials (the client secret of your account). You can create an endpoint at your back-end using express and consume it in your front-end, or use SSR if you're using NextJS.

### CommonJS

```javascript
const { Tropipay } = require("@yosle/tropipayjs");
```

### ES6

```javascript
import { Tropipay } from "@yosle/tropipayjs";
```

### Initialize the Tropipay class

You can instantiate the Tropipay class passing the client Id ,client secret and optionally the serverMode parameter, if no serverMode is provided, `Development` will be used as default. Make sure you use the [test environment](https://tropipay-dev.herokuapp.com) credentials when serverMode is on `Development`.

```javascript
// test environment server tropipay-dev.herokuapp.com
const config = {
    clientId: process.env.TROPIPAY_CLIENT_ID,
    clientSecret: process.env.TROPIPAY_CLIENT_SECRET
    serverMode: 'Development' // it will be used as default if omited
}
const tpp = new Tropipay(config)
```

To use your live credentials (real account) you must explicity set serverMode to `Production`.

```javascript
//real account credentials
const config = {
  clientId: process.env.TROPIPAY_CLIENT_ID,
  clientSecret: process.env.TROPIPAY_CLIENT_SECRET,
  serverMode: "Production", //live account
};
const tpp = new Tropipay(config);
```

### Generating a Payment Link

```javascript
/*
 * Example Payload
 */
const payload = {
  reference: "my-paylink-1",
  concept: "Bicycle",
  favorite: true,
  amount: 3000,
  currency: "EUR", // USD, EUR, USDC or USDT
  description: "Two wheels",
  singleUse: true,
  reasonId: 4,
  expirationDays: 1,
  lang: "es",
  urlSuccess: "https://webhook.site/680826a5-199e-4455-babc-f47b7f26ee7e",
  urlFailed: "https://webhook.site/680826a5-199e-4455-babc-f47b7f26ee7e",
  urlNotification: "https://webhook.site/680826a5-199e-4455-babc-f47b7f26ee7e",
  serviceDate: "2021-08-20",
  client: {
    name: "John",
    lastName: "McClane",
    address: "Ave. Guadí 232, Barcelona, Barcelona",
    phone: "+34645553333",
    email: "client@email.com",
    countryId: 1,
    city: "Barcelona",
    postCode: "08013",
    termsAndConditions: true,
  },
  directPayment: true,
  // Optional: payment methods offered on the payment page.
  // "TPP" (Tropipay balance), "EXT" (external card), "CRYPTO",
  // "WIRE_TRANSFER", "APPLE_PAY", "GOOGLE_PAY", "TPP_GIFTCARD", "TROPICARD".
  // If omitted the server defaults to ["EXT", "TPP", "WIRE_TRANSFER"].
  // APPLE_PAY/GOOGLE_PAY are added automatically when EXT is present.
  // The list is intersected with the methods enabled on your account.
  paymentMethods: ["EXT", "TPP", "CRYPTO"],
  // Optional: account that receives the payment (multi-account).
  // Get valid ids from tpp.accounts.list(). Defaults to your default account.
  accountId: 12345,
};
// Use inside an async function
const paylink = await tpp.paymentCards.create(payload);
console.log(paylink.shortUrl);
```

### Multi-account support

A Tropipay user can hold several accounts (one per currency). Use the
`accounts` module to discover them and pass the `id` as `accountId`
when creating payment links or transfers:

```javascript
const accounts = await tpp.accounts.list();
// [{ id: 12345, accountNumber: "...", currency: "EUR", balance: 1000, ... }]

const balances = await tpp.accounts.allBalances();
const movements = await tpp.accounts.movements(12345, { limit: 20 });
```

### Transfers (payouts)

Send money to a beneficiary (requires 2FA and the `ALLOW_EXTERNAL_TRANSFER`
permission):

```javascript
// 1. simulate to preview fees and amounts
const preview = await tpp.transfers.simulate({
  amount: 5000,
  currency: "EUR",
  destinationCurrency: "EUR",
  depositaccountId: 678,
  reasonId: 3,
});

// 2. request the 2FA code (SMS/email). In Development use "123456".
await tpp.transfers.requestSecurityCode();

// 3. execute
const transfer = await tpp.transfers.payout({
  amount: 5000,
  currency: "EUR",
  destinationCurrency: "EUR",
  depositaccountId: 678,
  reasonId: 3,
  securityCode: "123456",
  accountId: 12345, // optional, multi-account
});
```

For more examples, please refer to the [Documentation](https://github.com/yosle/tropipayjs/blob/master/docs/)

### Refunding a Transaction

The library provides two methods for handling refunds with 2FA confirmation:

#### Request a Security Code (Production only)

In **Production** mode, you must first request a 2FA code via SMS:

```javascript
await tpp.requestSecurityCode();
// An SMS with the code will be sent to your phone
```

#### Refund a Movement

Once you have the security code (or in Development mode), you can refund a transaction:

```javascript
// Development mode — use the default test code
const result = await tpp.refundMovement("ORD-123456", 5000, "123456");

// Production mode — pass the code received via SMS
const result = await tpp.refundMovement("ORD-123456", 5000, "847291");
```

**Note:** The refund endpoint requires the `ALLOW_REFUND` scope and 2FA to be enabled on your Tropipay account. In Development mode the default 2FA code is `123456` unless you have configured the Authenticator app.

# Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

You can also make a small [donation to the author](https://tppay.me/l94qaa3h) of the library.

# License

Distributed under the MIT License. See `LICENSE.txt` for more information.
