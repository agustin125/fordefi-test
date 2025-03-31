# Fordefi Transaction Sender

This Node.js script uses the Fordefi API to send a transaction from your Vault to a recipient address. 

## 🔧 Features

- Secure POST transaction to the Fordefi API
- Environment-based configuration for secrets

##  📚 Resources

-   [API Signer](https://docs.fordefi.com/developers/program-overview)
-   [Developer Guider](https://docs.fordefi.com/developers/api-overview)


---

## 📦 Installation

```bash
npm install
```


## 🛠️ Configuration

Create a .env file in the root directory:

```bash
ACCESS_TOKEN=your_api_user_access_token
PRIVATE_KEY_PATH=./private.pem
VAULT_ID=your_vault_id
```

Add your private key file as private.pem in the same directory .

Fill in the requestJson object in index.js with your transaction data.

## 🐳 Start  Signer Docker image


```bash
npm run docker
```


## 🚀 Usage


Run using the API:

```bash
npm run send
```

Run using the provider:

```bash
npm run send:provider
```

