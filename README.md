# smart-contract



[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  ###### Check out the badges hosted by [shields.io](https://shields.io/)

 [Deployed Heroku Link](https://smart-contract-latency-2881eb8bf0c3.herokuapp.com/)
  
  ## Description
  **This project features fullstack app meant to measure the latency for calling a simple contract that emit an event which will be listened by our server. Then using the emited time to calculate our latencies writing to the network, vs reading from the contract. Then the data is displayed in react with dynamic heights and color.

  ***

  ## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [Snippets](#snippets)
  - [License](#license)
  - [Author](#author)

  ***

  ## Installation

  ~~***This project is hosted on a heroku eco-dyno, when it is not being actively used it requires a bit extra start up time. This can be mitigated by upgrading to the next tier on heroku.***~~
  
  [Deployed Heroku Link](https://smart-contract-latency-2881eb8bf0c3.herokuapp.com/)

  HardHat Deployment

  Included is hardhat folder for deploying contract to the different testnets:
  
  After `npm install` within this hardhat folder you can run `npx hardhat run scripts/deploy.js --network *networkname*` to deploy to the network that was declared in the setting file.

  Once compelted, we would require manually setting these deployed addresses to call the contract from our server.

  For documentation purposes, here are the current deployed contract address for the following testnets:
  > Eth-sepolia: 0xA1284BF0e4326C2e1AA597EadDc9f081A76Dfa48 | https://eth-sepolia.g.alchemy.com/v2/

  > Poly-amoy: 0xf77CC6fc2df2Ea00deE9bf4cFf26DE673B299b03 | https://polygon-amoy.g.alchemy.com/v2/
  
  > Arbitrum:  0xB134BB71d6DE99dB9C18F87f61bD7313b20670F6 | https://arb-sepolia.g.alchemy.com/v2/
  
  > Base: 0x1B0FD62516d4C71E722E2e695D14cc024bD9F3b3 | https://base-sepolia.g.alchemy.com/v2/

  *Please see [Snippets](#snippets) for a breakdown of the contract.*

  ***
  
  If you would like to host a local version of it yourself, please follow these instructions:

  > ensure your `env` file is set up with 
  > - `DB_NAME`
  > - `DB_PASSWORD`
  > - `DB_USER`
  > - `SECRET`(db secret phrase)
  > - `ALCHEMY_API_KEY`(since we are using the Alchemy RPCs)
  > - `SECRET_KEY`(the wallet we want to use to interact with our contract).

  > to install both the client and server side dependencies: `npm run install` at the project root folder

  > navigate to your SQL CLI, initiate/reset our db instance: `mysql -u -root -p` | `source smart-contract/server/db/schema.sql`

  > start the server to sync our table: `npm start`

  > adding initial network seed data: `npm run seed`

  > to concurrently start server and client react code w/ hotreload: `npm run develop`

  ***
  ## Usage
  > **Write and Read latencies on seperate tabs**
  >
  > ![gif0](/client/src/assets/tab.gif)

  > **Dynamic status bar and color**
  >
  > ![gif1](/client/src/assets/dynamic.gif)

  > **Status Focus on hover/click**
  >
  > ![gif2](/client/src/assets/focus.gif)
  
  
  ***
  ## Snippets
  > **To call our smart contract, we need the Contract ABI artifact generated by our hardhat, and config,so ether.js can help us set up our listeners and interactivity**
  > 
  > ![snip1](/client/src/assets/config.png)
  > ![snip0](/client/src/assets/ABI.png)

  > **Listener set up**
  >
  > ![snip2](/client/src/assets/setup.png)
  > ![snip3](/client/src/assets/listener.png)

  > **Variable gasPrice, ensure Polygon transaction can goes through**
  > 
  >![snip4](client/src/assets/error.png)
  >![snip5](/client/src/assets/varPrice.png)

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


  