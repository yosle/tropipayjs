TropipayJS -Typescript/Javascript SDK for Tropipay Payments API
===========
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

TropiPay is an electronic wallet that allows you to execute the most common financial operations of the day to day. This is an SDK for Typescript and Javacript that helps you build integrations with the Tropipay platform in an easier way. Can save you a lot of time and effort implementing all the API features. You can use this library with CommonJS system (like node + express) or ES6 module system (NextJS).

## Project status
This library is still under development so using it in the live (real account) isn't recommended yet.

# Table of Contents
* [Getting started](#getting-started)
* [Setting up your credentials](#setting-up-your-app-credentials)
* [Documentation](#documentation)
* [Examples](#examples)
* [Contribute and Help](#contributing-and-help)

# Getting started
You can use npm or yarn to install this package:

`npm install @yosle/tropipayjs` 
or
`yarn add yosle.tropipayjs`

## Setting up your app credentials
![alt](/docs/images/app-credentials-menu.png)
![alt](/docs/images/confirmation-code-screen.png)
In order to use the Tropipay API you'll need a client ID and a client secret. Sign up with your [Tropipay](www.tropipay.com) account, go to the App Menu->Applications and credentials. You'll be asked to enter a confirmation code (use 123456 in the test enviroment). _Make sure you test everything in the [test enviroment](https://tropipay-dev.herokuapp.com) first before using your real account._ Create an app and configure the client id an client secret for the app.

## How to use
The Tropipay instance, allows you to access all the method available in the API. This Object is meant to be used *only in server side*. Do not use the Tropipay object on the client side (browser). This would expose your app credentials (the client secret of your account). You can create an endpoint at your back-end using express and consume it in your front-end, or use SSR if you're using NextJS.

### CommonJS 
```javascript
const { Tropipay } = require('@yosle/tropipayjs')
```
### ES6 
```javascript
import { Tropipay } from '@yosle/tropipayjs'
```
### Initialize the Tropipay class
```javascript
const tpp = new Tropipay("yourclientidhere",
    "yourclientsecrethere")
```
## Generating a Payment Link
```javascript
const paylink = await tpp.createPayLink(payload)
```

# Documentation
Examples using express + nodejs and NextJS will be added soon.

# Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)



