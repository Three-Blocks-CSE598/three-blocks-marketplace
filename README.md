# Three Blocks Marketplace

## Authors
- Harshak Krishnaa Keerthipati
- Rajkumar Sukumar
- Sai Ramya Linga

## Development Setup
1) Install `node`, and `npm` on your computer which is required for running this project.
2) Install the dependencies for our project by running `npm install`
3) Ensure you have `ganache` installed and running on your machine. This is necessary to run the test blockchain network on your computer.
   - `npm i -g ganache`
4) Start the RPC server using ganache: `ganache -p 7545`
5) Ensure you have `truffle` installed using `npm i -g truffle`
6) Migrate our marketplace smart contract by running `truffle migrate --reset` inside the project directory.
7) Install [MetaMask extension](https://metamask.io) on a compatible web browser.
8) Add the local ganache network manually by opening MetaMask extension settings. Usual configuration would be:
   1) Name it anything that you wish
   2) RPC URL : http://localhost:7545
   3) Chain ID : copy from the ganache CLI output.
   4) Currency symbol : ETH
9) From `ganache`'s CLI output, copy one of the private keys and import it into the MetaMask extension.
10) Run `npm start` within the project directory to start our web application.
11) Open http://localhost:3000 and start playing around with the marketplace by adding products and buying them!
    - Note that you have to switch to a different account by importing a different private key into the extension, before you can buy someone else's product.