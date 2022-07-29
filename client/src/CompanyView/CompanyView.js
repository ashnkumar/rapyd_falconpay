import React, { useEffect, useState } from 'react';
import sidebar from '../images/sidebar.png'
import flagimage from '../images/IE2x.png'
import ProgressBar from "@ramonak/react-progress-bar";
import ReactModal from 'react-modal';
import CreateTicketModal from './CreateTicketModal';
import { getVAInfo } from '../api'

import dkflag from '../images/DK@2x.png'
import gbflag from '../images/GB@2x.png'
import mxflag from '../images/MX@2x.png'
import usflag from '../images/US@2x.png'
import sgflag from '../images/SG@2x.png'
import deflag from '../images/DE@2x.png'
import rectangle from '../images/Rectangle.png'

const CURRENCY_MAP2 = {
  "SG": {
    flag: sgflag,
    bigImage: rectangle,
    country_code: "SG",
    currencies: ["SGD", "USD"]
  },
  "US": {
    flag: usflag,
    bigImage: rectangle,
    country_code: "US",
    currencies: ["USD"]
  },
  "GB": {
    flag: gbflag,
    bigImage: rectangle,
    country_code: "GB",
    currencies: ["GBP"]
  },
  "DE": {
    flag: deflag,
    bigImage: rectangle,
    country_code: "DE",
    currencies: ["EUR"]
  },
  "DK": {
    flag: dkflag,
    bigImage: rectangle,
    country_code: "DK",
    currencies: ["AED", "AUD", "CAD", "CHF", "CZK", "DKK", "HKD", "HRK", "HUF", "ILS", "JPY", "MXN", "NOK", "NZD", "PLN", "RON", "SAR", "SEK", "SGD", "TRY", "USD", "ZAR"]
  },
  "MX": {
    flag: mxflag,
    bigImage: rectangle,
    country_code: "MX",
    currencies: ["MXN"]
  }
}

function ExistingTicketInfo({thisVA}) {
  const coutnryFlag = CURRENCY_MAP2[thisVA.metadata.country].flag
  const usdPaid = Math.min(thisVA.metadata.amountUSD, thisVA.balance / thisVA.metadata.currencyRate)
  const usdTotal = thisVA.metadata.amountUSD
  const usePerc = usdPaid / usdTotal
  const usdPaidText = `${(usdPaid / 1000).toFixed(0)}K`
  const usdTotalText = `${(usdTotal / 1000).toFixed(0)}K`
  const completedVal = Math.min(100, (usePerc * 100).toFixed(0))
  return (
    <React.Fragment>
      <div className="flagdiv"><img src={coutnryFlag} loading="lazy" alt="" className="image" /></div>
      <div className="meterdiv">
        <div className="meterpaidtext">
          <div className="meterpaidtextext">Paid: ${usdPaidText} / ${usdTotalText}</div>
        </div>
        <div className="metermeterdiv">
          <ProgressBar 
            className={"metermeterdiv"}
            animateOnRender={true} 
            borderRadius={"10px"}
            bgColor={completedVal < 55 ? "orange" : "#13A850"}
            height={"30px"}
            isLabelVisible={false}
            width={"120px"}
            completed={completedVal} 
            />
        </div>
      </div>      
    </React.Fragment>
  )
}

function TicketView({ticketNum, ticketID, thisVA, openCreateLink}) {
  return (
    <div className="ticketdiv">
      <div className="ticketleftdiv">
        <div className="ticketnametext">Ticket #{ticketNum+1}</div>
      </div>
      <div className="ticketdivider"></div>
      <div className="ticketrightdiv">
        <div className="ticketstatusdiv">
          <div className="ticketstatustext">{thisVA ? "Assigned" : "Unassigned"}</div>
        </div>
        <div className="ticketrightrightdiv">
          {
            thisVA
            ? <ExistingTicketInfo thisVA={thisVA} />
            :  <div className="createlinkbuttondiv">
                <div 
                  onClick={() => openCreateLink(ticketID)}
                  className="createlinktext">Create Link</div>
              </div>
          }
        </div>
      </div>
    </div>  
  )
}

function TripView({tripInfo, allVAs, onOpenCreateLink}) {

  const _openCreateLink = (ticketID) => {
    onOpenCreateLink(tripInfo.tripID, ticketID)
  }

  return (
    <div className="tripdiv">
      <div className="triptitlediv">
        <div className="triptext">{tripInfo.name}</div>
      </div>
      {
        tripInfo.tickets.map((ticketID, ticketNum) => {
          const relevantVAs = allVAs.filter((va) => {
            return va.metadata && va.metadata.ticketID === ticketID
          })
          var current_max = 0
          var current_max_idx = 0
          relevantVAs.forEach((v, idx) => {
            if (v.balance > current_max) {
              current_max = v.balance
              current_max_idx = idx
            }
          })
          return (
            <TicketView 
              key={ticketID}
              ticketNum={ticketNum}
              ticketID={ticketID}
              thisVA={relevantVAs[current_max_idx]}
              openCreateLink={_openCreateLink}/>
          )

        })
      }
    </div>    
  )
}

export default function CompanyView({trips}) {

  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  const [ticketTripID, setTicketTripID] = useState(null)
  const [ticketID, setTicketID] = useState(null)
  const [allVAs, setAllVAs] = useState([])

  const openCreateLinkModal = (tripID, ticketID) => {
    setTicketTripID(tripID)
    setTicketID(ticketID)
    setIsCreatingTicket(true)
  }

  const updateVAs = async () => {
    const _allVAs = await getVAInfo()
    var allTicketIDs = []
    Object.keys(trips).forEach((t) => {
      const tickets = trips[t].tickets
      tickets.forEach((tt) => {
        allTicketIDs.push(tt)
      })
    })
    const relevantVAs = _allVAs.virtual_accounts.filter((va) => {
      return va.metadata && allTicketIDs.includes(va.metadata.ticketID)
    })

    setAllVAs(relevantVAs)
  }  

  return (
    <div className="bigdiv">
      {
        isCreatingTicket
        && <CreateTicketModal 
              ticketTripID={ticketTripID}
              ticketID={ticketID}
              onRequestClose={() => setIsCreatingTicket(false)}/>
      }
      <div onClick={() => updateVAs()}
      className="sidebardiv">
        <div className="sidebarbutton"></div><img src={sidebar} loading="lazy" width="263" alt="" />
        <div className="sidebarbutton"></div>
      </div>
      <div style={{paddingTop: 30}} className="rightsidediv">
        <div onClick={() => updateVAs()} style={{backgroundColor: "#13A850"}} className="createlinkbuttondiv">
          <div className="createlinktext">
              Refresh Data
          </div>
        </div>
        <div className="titlediv">
          <div className="launchtextdiv">
            <div className="launchtext">Launch Manifest - July 2022</div>
          </div>
        </div>
        {
          Object.keys(trips).map((t) => (
            <TripView 
              key={t}
              tripInfo={trips[t]} 
              allVAs={allVAs}
              onOpenCreateLink={openCreateLinkModal} />
          ))
        }

      </div>
    </div>
  )
}