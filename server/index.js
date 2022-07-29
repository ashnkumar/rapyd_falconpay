require('dotenv').config()
const express = require("express");
var bodyParser = require('body-parser')
const makeRequest = require('./utilities').makeRequest;

const PORT = process.env.PORT || 3001;
const WALLET_ID = process.env.WALLET_ID
const IP_KEY = process.env.IP_KEY

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/get-ip-key", async (req, res) => {
  return res.json({ipKey: IP_KEY})
})

app.get("/get-virtual-accounts", async (req, res) => {
  const wallet_id = WALLET_ID
  const path_string = `/v1/issuing/bankaccounts/list?ewallet=${wallet_id}`
  const result = await makeRequest('GET', path_string)
  const accounts = result.body.data.bank_accounts
  var VAs = []
  const individualVAs = await Promise.all(accounts.map(async (account) => {
    const _pathString2 = `/v1/issuing/bankaccounts/${account.issuing_id}`
    const vaData = await makeRequest('GET', _pathString2)
    var totalBalance = 0
    vaData.body.data.transactions.forEach((t) => {
      totalBalance += t.amount
    })
    VAs.push({
      id: vaData.body.data.id,
      metadata: vaData.body.data.metadata,
      balance: totalBalance
    })
  }));
  
  const returnObj = { 
    virtual_accounts: VAs
  }  
  console.log("Finished getting virtual accounts")
  return res.json(returnObj)
})


app.get("/get-rate", async (req, res) => {
  
  const sell = req.query.sell
  const buy = req.query.buy
  const path_string = `/v1/rates/daily?action_type=payment&buy_currency=${buy}&sell_currency=${sell}`
  const result = await makeRequest('GET', path_string)
  const returnObj = { 
    rate: result.body.data.rate
  }  
  return res.json(returnObj)
})

app.post("/simulate-transfer", async (req, res) => {
  console.log("Simulating transfer ...")
  const issued_bank_account = req.body.issued_bank_account
  const currency = req.body.currency
  const amount = req.body.amount
  const body = {
    issued_bank_account,
    currency,
    amount
  }
  const result = await makeRequest('POST', '/v1/issuing/bankaccounts/bankaccounttransfertobankaccount', body)
  console.log("Finished transfer!")
  return res.json({ status: result.body.status})
})

app.post("/create-va", async (req, res) => {
  console.log("Creating VA ...")
  const country = req.body.country
  const currency = req.body.currency
  const currencyRate = req.body.currencyRate
  const ticketID = req.body.ticketID
  const amountUSD = req.body.amountUSD
  const amountLocalCurrency = req.body.amountLocalCurrency
  const body = {
    ewallet: WALLET_ID,
    country: country,
    currency: currency,
    metadata: {
      ticketID: ticketID,
      amountUSD: amountUSD,
      currency: currency,
      currencyRate: currencyRate,
      amountLocalCurrency: amountLocalCurrency,
      country: country
    }
  }
  const result = await makeRequest('POST', '/v1/issuing/bankaccounts', body)
  console.log("Finished creating")
  console.log(result.body.data)
  return res.json({ 
    vaID: result.body.data.id, 
    bankAccountInfo: result.body.data.bank_account,
    country: result.body.data.bank_account.country,
    currency: result.body.data.currency,
    currencyRate: result.body.data.currencyRate
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});