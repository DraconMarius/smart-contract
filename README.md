# smart-contract



[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  ###### Check out the badges hosted by [shields.io](https://shields.io/)

 [Deployed Heroku Link](https://smart-contract-latency-2881eb8bf0c3.herokuapp.com/)
  
  ## Description
  **This project a fullstack app meant to measure the latency for calling a simple contract that emit an event which will be listened by our server. Then displayed in react with dynamic heights and color coded.

  ***

  ## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)
  - [Author](#author)

  ***

  ## Installation

  ~~***This project is hosted on a heroku eco-dyno, when it is not being actively used it requires a bit extra start up time. This can be mitigated by upgrading to the next tier on heroku.***~~
  
  [Deployed Heroku Link](https://smart-contract-latency-2881eb8bf0c3.herokuapp.com/)

  HardHat Deployment

  Included is hardhat folder for deploying contract to the different testnets: run `npx hardhat run scripts/deploy.js --network *networkname*` to deploy to the network that was declared in the setting file.

  Once ompelted, we would require these addresses to call the contract from our server.

  For documentation purposes, here are the deployed contract address for the following testnets:
  > Eth-sepolia: 0xB3A2bF2c143970c10618ED8E4007b68D55e63eb0 / 0xA1284BF0e4326C2e1AA597EadDc9f081A76Dfa48
  > Poly-amoy: 0xB13a80d106f97669D53E64004DC4507c8D2C02BD / 0xf77CC6fc2df2Ea00deE9bf4cFf26DE673B299b03
  > Arbitrum: 0xD830Bf02536F8F7c22E359A6d775219F52374FE9 / 0xB134BB71d6DE99dB9C18F87f61bD7313b20670F6
  > Base: 0xfE45f33b94953D779De8CB97D87f4e700f7684aC / 0x1B0FD62516d4C71E722E2e695D14cc024bD9F3b3

  This simple smart contract is written in solidity and simply emit an event for our server to listen to.

  ***
  
  If you would like to host a version of it yourself, please follow these instructions:

  > to install both the client and server side dependencies: `npm run install`

  > start the server: `npm start`

  > to concurrently start server and client react code w/ hotreload: `npm run develop`

  ***
  ## Usage

  
  ***

  ***
  ## License

  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  ***
  ## Author
  *Mari Ma*

  [<img src="https://res.cloudinary.com/dbjhly3lm/image/upload//h_50/v1682488301/personal%20assets/logo_github_icon_143196_phgakv.png" alt='github' >](https://github.com/DraconMarius)
  [<img src="https://res.cloudinary.com/dbjhly3lm/image/upload/h_50/v1682488301/personal%20assets/logo_linkedin_icon_143191_nv9tim.png" alt='linkedin'>](https://www.linkedin.com/in/mari-ma-70771585/)

[Icon credit @ Anton Kalashnyk](https://icon-icons.com/users/14quJ7FM9cYdQZHidnZoM/icon-sets/)

  ***
  ## Questions
  For any questions, please reach out directly or by creating an issue.


  