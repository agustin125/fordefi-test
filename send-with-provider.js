require("dotenv").config();
const fs = require("fs");
const { FordefiWeb3Provider } = require("@fordefi/web3-provider");
const { ethers } = require("ethers");

const accessToken = process.env.ACCESS_TOKEN;
const privateKeyFile = process.env.PRIVATE_KEY_PATH;

async function sendTransactionWithProvider() {
    try {
        if (!accessToken || !privateKeyFile) {
            throw new Error("Missing ACCESS_TOKEN or PRIVATE_KEY_PATH in environment variables.");
        }

        const secretPem = fs.readFileSync(privateKeyFile, "utf8");
        const from = "0xa780CcBccE0316b04519417039CCD33D9580CC23";
        const config = {
          chainId: 8453,
          address: from,
          apiUserToken: accessToken,
          apiPayloadSignKey: secretPem,
        };
        
        const provider = new FordefiWeb3Provider(config)

        const onConnect = ({ chainId }) => {
          console.log(`Connected to chain ${chainId}`);
        }
               
        const result = await provider.waitForEmittedEvent('connect');
        onConnect(result);

        const recipient = "0x8BFCF9e2764BC84DE4BBd0a0f5AAF19F47027A73";
        const tokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        const decimals = 6;
        const amountToSend = "0.1";
        const amount = ethers.parseUnits(amountToSend, decimals);

        const erc20Interface = new ethers.Interface([
          "function transfer(address to, uint256 amount)"
        ]);

        const data = erc20Interface.encodeFunctionData("transfer", [recipient, amount]);

        const txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from,
            to: tokenAddress,
            data,
          }],
        });
        
        console.log(`Transaction hash: ${txHash}`);
    } catch (error) {
        console.error("Error sending transaction:", error.message);
    }
}

sendTransactionWithProvider();
