export const getCurrencyRate = async (buyCurrency, sellCurrency) => {
  const rateInfo = await fetch(`/get-rate?sell=${sellCurrency}&buy=${buyCurrency}`)
  return rateInfo.json()  
}

export const createVirtualAccount = async (ticketID, amountUSD, amountLocalCurrency, currency, country, currencyRate) => {
  const result = 
    await fetch('/create-va', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                  {
                    currency: currency,
                    currencyRate: currencyRate,
                    country: country,
                    ticketID: ticketID,
                    amountUSD: amountUSD,
                    amountLocalCurrency: amountLocalCurrency
                  }
                )
              })
  const resultJSON = await result.json()
  return resultJSON
}

export const simulateTransfer = async (vaID, vaCurrency, simTransferAmount) => {
  const result = 
    await fetch('/simulate-transfer', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                  {
                    issued_bank_account: vaID,
                    amount: parseInt(simTransferAmount),
                    currency: vaCurrency
                  }
                )
              })
  const resultJSON = await result.json()
  return resultJSON.status
}

export const getVAInfo = async () => {
  const vaInfoRes = await fetch(`/get-virtual-accounts`)
  return vaInfoRes.json()
}

export const getSingleVA = async (id) => {
  const vaInfoRes = await fetch(`/get-single-virtual-accounts?id=${id}`)
  return vaInfoRes.json()
}

export const getIPKey = async () => {
  const ipKeyRes = await fetch(`/get-ip-key`)
  return ipKeyRes.json()
}