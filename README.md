## Overview
Launch Pay is an app built on top of Rapyd's Virtual Accounts that lets Rapyd merchants get a single link to send to their customers -- regardless of where they're located -- and dynamically generate Virtual Accounts on their behalf in local currencies, using the IP address of the customer.

## How it works:
1. A space tourism company -- or any company! -- can put in a few details of a large purchase like the total price in the company's home currency (e.g. USD if they're based in the US).
2. Launch Pay will provide a **one-time web link** that they can use to share with their customer (e.g. the tourist booking the space tour). This can be shared over email, text, on a website or anywhere else!
3. When the customer opens that web link, launch pay uses the **IP Address** of that customer to determine which country they're based in, and lets them select the currency they'd like to pay with through bank transfer.
4. Once the customer chooses their currency, Launch Pay spins up a **Virtual Account** on the fly that is tied to that specific customer, in that currency and in that country. The customer sees the bank account information needed to send money for payment.
5. As the customer pays their deposits or other payments into this account, Launch Pay auto-reconciles these payments to that specific customer

## The key value proposition: the merchant doesn't have to keep track of customer's locations at all!
On the merchant side, we're solving a massive issue that we've heard time and time again: "we'd love to expand globally but each jurisdiction has its own regulations and it's hard to keep track of payments from different currencies."

When a merchant uses Launch Pay, they can just send the link out and trust that Launch Pay will handle displaying the right geographic info to each customer, converting the FX, and reconciling it all on their behalf.

## How we built it
The underlying architecture works like this:
1. When the merchant selects the price of their offering and identifying information (e.g. the ID of the ticket they're selling), our app generates a link that embeds that information into the URL.
2. When their customer opens the link, the app uses a server-side IP address API to determine the country that the customer is based in.
3. We hit Rapyd's currency capabilities endpoint to see which currencies are available for the customer in that country, and when the customer chooses a currency, we use Rapyd's Daily Rate API to determine the price of the item in their local currency.
4. The app creates a Virtual Account through Rapyd's API in that country and currency, and displays the bank information to the end customer so they can transfer funds (we use the Simulate Transfer mechanism for the hackathon).
5. We're saving all fields needed for reconciliation in the **metadata** field of the virtual account, so we can tie each payment to the relevant product ID and embed information around the currency rate used at time of sale.
6. On the merchant UI, we query for all Virtual Accounts to see which ones match the products they're looking at and then enrich their data with payment info from Rapyd.


## Challenges we ran into
We really wanted to go a step further and build the **B2B supplier side** of this so the space tourism company can spin up Virtual Accounts to pay suppliers in local currency - the Simulate Transfer API didn't allow us to specify a bank account to send money from, but we're going to try building it as a wallet-to-wallet transfer instead :)


## What we learned
Global commerce is very tricky. Virtual Accounts are a game changer for letting customers pay merchants, but we're super excited on how they can be used on the B2B side to build a truly global, distributed financial infrastructure for companies from day 1.


## What's next for Launch Pay
As noted above - we want to explore how we could use both wallets and Virtual Accounts to go a step further and build the B2B "marketplace" platform where funds wouldn't have to leave Rapyd's ecosystem at all.
