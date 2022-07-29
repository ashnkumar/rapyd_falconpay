import React, { useEffect, useState } from 'react';
import CompanyView from './CompanyView/CompanyView'
import CheckoutView from './CheckoutView/CheckoutView'
import SpinnerView from './CheckoutView/SpinnerView';
import CreateTicketModal from './CompanyView/CreateTicketModal';
import CreateVAModal from './CheckoutView/CreateVAModal';

function genR(max) {
  return Math.floor(Math.random() * max) + 1;
}

const TRIPS = {
  trip1: {
    name: "Trip #1AB - 29.07.22",
    tripID: "trip1",
    tickets: [`trip1_${genR(10000)}`, 
              `trip1_${genR(10000)}`, 
              `trip1_${genR(10000)}`]
  },
  trip2: {
    name: "Trip #2AB - 31.07.22",
    tripID: "trip1",
    tickets: [`trip2_${genR(10000)}`, 
              `trip2_${genR(10000)}`, 
              `trip2_${genR(10000)}`]
  }
}

export default function App({}) {

  const [mode, setMode] = useState('company')

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('ticketID')) {
      setMode('checkout')
    }
  }, [])

  return (
      mode === "company"
      ? <CompanyView trips={TRIPS} />
      : <CheckoutView trips={TRIPS} />
  )
}