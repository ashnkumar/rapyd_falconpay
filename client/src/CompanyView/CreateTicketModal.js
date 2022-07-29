import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

export default function CreateTicketModal({ticketTripID, ticketID, 
  onRequestClose}) {
  
  const [amount, setAmount] = useState(100000)
  const [ticketLink, setTicketLink] = useState('')

  const onCreateLink = (e) => {
    if (parseInt(amount) < 1) {
      e.preventDefault()
    }
    else {
      const base_url = window.location.href
      const queryFull = `${base_url}?ticketID=${ticketID}&amount_usd=${amount || 100000}&tripID=${ticketTripID}`
      setTicketLink(queryFull)
    }
  }
  
  return (
    <ReactModal 
      ariaHideApp={false}
      isOpen={true}
      closeTimeoutMS={500}
      className="tripdiv ticket"
      overlayClassName="myoverlay"
      onRequestClose={() => onRequestClose()}
      >
      {/* <div className="tripdiv ticket"> */}
        <div className="triptitlediv">
          <div className="triptext">Create Ticket</div>
        </div>
        <div className="priceinputidv">
          <div className="pricetext">Price of ticket in USD</div>
          <input 
            className="inputarea"
            type="number" min="1" step="1" value={amount}
            onChange={e => setAmount(e.target.value)} />     
          {/* <div className="inputarea">

          </div> */}
        </div>
        <div style={{backgroundColor: parseInt(amount) >= 1 ? "#1a2acb" : "gray"}} className="createlinkbuttondiv inner b">
          <div 
            onClick={(e) => onCreateLink(e)}
            className="createlinktext b">
            Create Link
          </div>
        </div>
        {
          ticketLink && 
          <React.Fragment>
            <div className="pricetext">Link below will open in a separate tab</div>
            <div className="inputarea copy">
            <a target="_blank" href={ticketLink}>Link for customer</a>
          </div>            
          </React.Fragment>

        }

    {/* </div>     */}
    </ReactModal>
  )
}