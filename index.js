require("dotenv").config();
const crypto = require("crypto");
const fs = require("fs");

const accessToken = process.env.ACCESS_TOKEN;
const privateKeyFile = process.env.PRIVATE_KEY_PATH;
const vaultId = process.env.VAULT_ID;
const gatewayHost = "api.fordefi.com";
const path = "/api/v1/transactions";


const requestTransferJson = {
  "signer_type":"api_signer",
  "type":"evm_transaction",
  "details":{
     "type":"evm_transfer",
     "gas":{
        "type":"priority",
        "priority_level":"medium"
     },
     "to":"0x8BFCF9e2764BC84DE4BBd0a0f5AAF19F47027A73",
     "value":{
        "type":"value",
        "value":"100000"
     },
     "asset_identifier":{
        "type":"evm",
        "details":{
           "type":"erc20",
           "token":{
              "chain":"evm_8453",
              "hex_repr":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
           }
        }
     }
  },
  "note":"Sending USDC",
  "vault_id": vaultId
}


async function sendTransaction() {
    try {
        if (!accessToken || !privateKeyFile) {
            throw new Error("Missing ACCESS_TOKEN or PRIVATE_KEY_PATH in environment variables.");
        }

        const requestBody = JSON.stringify(requestTransferJson);
        const timestamp = new Date().getTime();
        const payload = `${path}|${timestamp}|${requestBody}`;

        const secretPem = fs.readFileSync(privateKeyFile, "utf8");
        const privateKey = crypto.createPrivateKey(secretPem);
        const sign = crypto.createSign("SHA256").update(payload, "utf8").end();
        const signature = sign.sign(privateKey, "base64");

        const response = await fetch(`https://${gatewayHost}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "X-Timestamp": timestamp,
                "X-Signature": signature,
            },
            body: requestBody,
        });

        const responseBody = await response.text();
        console.log("Response:", responseBody);
    } catch (error) {
        console.error("Error sending transaction:", error.message);
    }
}

sendTransaction();
