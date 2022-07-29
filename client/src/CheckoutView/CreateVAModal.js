import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { getVAInfo, createVirtualAccount, simulateTransfer } from '../api'
import SpinnerView from './SpinnerView';

export default function CreateVAModal({currency, ticketID, amountUSD, amountLocalCurrency, country, onRequestClose, countryCode, currencyRate}) {
  const [vaInfo, setVAInfo] = useState(null)
  const [isCreatingVA, setIsCreatingVA] = useState(false)
  const [amountToPay, setAmountToPay] = useState(1000)
  const [amountRemaining, setAmountRemaining] = useState(amountLocalCurrency ? amountLocalCurrency.toFixed(0) : 100000)
  const [isPayingVA, setIsPayingVA] = useState(false)

  const createVA = async () => {
    const vaInfo = await createVirtualAccount(ticketID, parseInt(amountUSD), amountLocalCurrency, currency, countryCode, currencyRate)
    setVAInfo(vaInfo)
    setIsCreatingVA(false)

  }

  useEffect(() => {
    if (!vaInfo && !isCreatingVA) {
      setIsCreatingVA(true)
      createVA()
    }
  }, [])

  const reset = () => {
    setAmountToPay('')
  }

  const simulatePayment = async () => {
    setIsPayingVA(true)
    await simulateTransfer(vaInfo.vaID, vaInfo.currency, amountToPay)
    const updatedVAs = await getVAInfo()
    const relevantVA = updatedVAs.virtual_accounts.filter((v) => {
      return v.id === vaInfo.vaID
    })[0]
    const remaining = Math.max(0,(parseInt(relevantVA.metadata.amountLocalCurrency) - relevantVA.balance).toFixed(0))
    setAmountRemaining(remaining)
    setTimeout(() => {
      setIsPayingVA(false)
    }, 3000)
    reset()
  }

  return (
    <div>
              {
          isPayingVA
          && <SpinnerView text="Paying ticket ..." />
        }
    
    <ReactModal 
      ariaHideApp={false}
      isOpen={true}
      closeTimeoutMS={500}
      className="tripdiv ticket pay"
      overlayClassName="myoverlay"
      onRequestClose={() => onRequestClose()}
      >
      <div>
      <div className="triptitlediv">
        <div className="triptext">Virtual Account Info</div>
      </div>
      {
        vaInfo
        && 
          <div>
          <div className="pricetext">ID: {vaInfo.vaID}</div>
          <div className="pricetext">
            {
              countryCode === 'SG'
              ? `bic: ${vaInfo.bankAccountInfo.bic}`
              : `iban: ${vaInfo.bankAccountInfo.iban}`
            }
          </div>            
          </div>
      }

      <div className="priceinputidv">
        <br />
        <div className="pricetext b">Choose payment amount ({currency}):</div>
        <input 
            className="inputarea"
            type="number"  min="1" step="1"  value={amountToPay}
            onChange={e => setAmountToPay(e.target.value)} />     
      </div>
      <div style={{backgroundColor: parseInt(amountToPay) >= 1 ? "#1a2acb" : "gray"}} className="createlinkbuttondiv inner payit">
        <div 
          onClick={(e) => amountToPay > 0 ? simulatePayment() : e.preventDefault()}
          className="createlinktext b">
          Pay Amount
        </div>
      </div>
      <div className="pricetext">Remaining: {amountRemaining}</div>
    </div>
    </ReactModal>    
    </div>


  )
}