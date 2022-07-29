import React, { useEffect, useState } from 'react';
import flagtemp from '../images/IE2x.png'
import { getCurrencyRate, getIPKey } from '../api'
import Select from 'react-select'
import CreateVAModal from './CreateVAModal';
import SpinnerView from './SpinnerView';

import dkflag from '../images/DK@2x.png'
import gbflag from '../images/GB@2x.png'
import mxflag from '../images/MX@2x.png'
import usflag from '../images/US@2x.png'
import sgflag from '../images/SG@2x.png'
import deflag from '../images/DE@2x.png'
import usBig from '../images/usBig.png'
import gbBig from '../images/gbBig.png'
import dkBig from '../images/dkBig.png'
import deBig from '../images/deBig.png'
import mxBig from '../images/mxBig.png'
import sgBig from '../images/sgBig.png'
import rectangle from '../images/Rectangle.png'
import unsupported from '../images/unsupported.png'


// http://localhost:3000/?ticketID=trip1_2579&amount_usd=150000&tripID=trip1
// Trip Name
// Trip Price
// Exchange Rate
// Country
// Currencies
const COUNTRIES = ["Singapore", "United States", "Denmark", "Germany", "United Kingdom", "Mexico"]
const CURRENCY_MAP = {
  "Singapore": {
    flag: sgflag,
    bigImage: sgBig,
    country_code: "SG",
    currencies: ["SGD", "USD"]
  },
  "United States": {
    flag: usflag,
    bigImage: usBig,
    country_code: "US",
    currencies: ["USD"]
  },
  "United Kingdom": {
    flag: gbflag,
    bigImage: gbBig,
    country_code: "GB",
    currencies: ["GBP"]
  },
  "Germany": {
    flag: deflag,
    bigImage: deBig,
    country_code: "DE",
    currencies: ["EUR"]
  },
  "Denmark": {
    flag: dkflag,
    bigImage: dkBig,
    country_code: "DK",
    currencies: ["AED", "AUD", "CAD", "CHF", "CZK", "DKK", "HKD", "HRK", "HUF", "ILS", "JPY", "MXN", "NOK", "NZD", "PLN", "RON", "SAR", "SEK", "SGD", "TRY", "USD", "ZAR"]
  },
  "Mexico": {
    flag: mxflag,
    bigImage: mxBig,
    country_code: "MX",
    currencies: ["MXN"]
  }
}

export default function CheckoutView({trips}) {
  
  const [ticketID, setTicketID] = useState(null)
  const [isCreatingVA, setIsCreatingVA] = useState(false)
  const [countryUnsupportable, setCountryUnsupportable] = useState(false)
  const [tripName, setTripName] = useState(null)
  const [tripID, setTripID] = useState(null)
  const [amountUSD, setAmountUSD] = useState(null)
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [totalConverted, setTotalConverted] = useState(null)
  const [countryName, setCountryName] = useState(null)
  const [currencyString, setCurrencyString] = useState(null)
  const [currencySelected, setcurrencySelected] = useState(null)
  const [currencyRate, setCurrencyRate] = useState(null)
  const [calculatingCountry, setCalculatingCountry] = useState(true)
  const [wantsToCreateVA, setWantsToCreateVA] = useState(false)
  const [finishedCreatingVA, setFinishedCreatingVA] = useState(false)

  const _getCurrencyRate = async () => {
    if (currencySelected === 'USD') {
      setCurrencyRate(1.0)
    }
    else {
      const rateObj = await getCurrencyRate(currencySelected, 'USD')
      setCurrencyRate(rateObj.rate)
    }
  }

  const getCountry = async () => {
    setCalculatingCountry(true)
    const _ipkey = await getIPKey()
    const ipkey = _ipkey.ipKey
    fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${ipkey}`, { 
        method: 'GET'
      })
      .then(function(response) { return response.json(); })
      .then(function(json) {
        setTimeout(() => {
          setCalculatingCountry(false)
          if (Object.keys(CURRENCY_MAP).includes(json.country.name)) {
            setCountryName(json.country.name)
          } else {
            setCountryName("Denmark")
            setCountryUnsupportable(true)
          }
        }, 5000)
      })
  }

  useEffect(() => {
    if (!countryName) {
      getCountry()
    } else {
      const _currencyOptions = CURRENCY_MAP[countryName].currencies.map((currency) => (
        {
          value: currency,
          label: currency
        }
      ))
      setCurrencyOptions(_currencyOptions)      
    }

  }, [countryName])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('ticketID')) {
      setTicketID(queryParams.get('ticketID'))
      setAmountUSD(queryParams.get('amount_usd'))
      setTripID(queryParams.get('tripID'))
      setTripName(trips[queryParams.get('tripID')].name)
    }
  }, [])

  useEffect(() => {
    if (currencySelected) {
      _getCurrencyRate()
    }
  }, [currencySelected])

  useEffect(() => {
    if (amountUSD && currencyRate && currencySelected) {
      const convertedAmount = amountUSD * currencyRate
      setCurrencyString(`USD 1.0 = ${currencyRate.toFixed(3)} ${currencySelected}`)
      setTotalConverted(convertedAmount)
    }
  }, [amountUSD, currencyRate, currencySelected])

  useEffect(() => {
    if (wantsToCreateVA) {
      setTimeout(() => {
        setWantsToCreateVA(false)
        setFinishedCreatingVA(true)
      }, 5000)
    }

  }, [wantsToCreateVA])
  

  if (tripID && ticketID && amountUSD) {
    return (
      <div className="bigdiv">
        {
          calculatingCountry && <SpinnerView text="Calculating Country from IP ..." />
        }
        {
          wantsToCreateVA
          && <SpinnerView text="Creating Virtual Account ..." />
        }
        {
          finishedCreatingVA
          && <CreateVAModal 
                currency={currencySelected}
                ticketID={ticketID}
                shouldShow={finishedCreatingVA}
                currencyRate={currencyRate}
                amountUSD={amountUSD}
                amountLocalCurrency={totalConverted || amountUSD}
                country={countryName || 'Unknown'}
                countryCode={CURRENCY_MAP[countryName].country_code}
                onRequestClose={() => setIsCreatingVA(false)}/>
        }        
        <div className="maindivcheckout">
          <div className="tripdiv checkout">
            <div className="triptitlediv checkout">
              <div className="triptext checkout">Rocket Tours</div>
            </div>
            <div className="triptitlediv subtitle">
              <div className="triptext checkout subttitel">{tripName}</div>
            </div>
            <div className="mapview">
              {
                countryUnsupportable
                ? <img 
                  src={unsupported} 
                  loading="lazy" width="400" alt="" />
                : <img 
                    src={countryName ? CURRENCY_MAP[countryName].bigImage : rectangle} 
                    loading="lazy" width="400" alt="" />
              }
            </div>
            <div className="countryflagcheckoutdiv">
              <div className="flagdiv">
                
                <img src={(countryName && CURRENCY_MAP[countryName]) ? CURRENCY_MAP[countryName].flag : rectangle} loading="lazy" width="327" alt="" /></div>
              <div className="coutnryname">{countryName || 'Unknown'}</div>
              <div className="cureecnypickerdiv">
                <Select
                  options={currencyOptions}
                  onChange={(f) => setcurrencySelected(f.value)}
                />
              </div>
            </div>
            <div className="exchangeratetext"><strong>Exchange Rate: </strong>
              {currencyString || 'Unknown'} 
            </div>
            <div className="totaldiv">
              <div className="totaltext">Total to pay:</div>
              <div className="totaltext right">{
                  totalConverted ? `${totalConverted.toFixed(0)} ${currencySelected}`
                  : 'Unknown'
            }</div>
            </div>
            <div style={{backgroundColor: currencySelected ? "#1a2acb" : "gray"}} className="paynowbutton">
              <div onClick={(e) => currencySelected ? setWantsToCreateVA(true) : e.preventDefault()} className="paynowtext">
                PAY NOW
              </div>
            </div>
          </div>
        </div>
      </div>    
    )    
  } else {
    return `${amountUSD}`
  }
}