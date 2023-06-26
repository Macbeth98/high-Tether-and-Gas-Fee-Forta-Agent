# Large Tether Transfer and High Gas Fee Agent

## Description

This agent detects transactions with large Tether transfers and the transactions with High Gas Fee.
The High Gas Fee Agent uses CryptoCompare API to fetch the USD price.

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this agent

- FORTA-1

  - Fired when a transaction contains a Tether transfer over 10,000 USDT
  - Severity is always set to "low" (mention any conditions where it could be something else)
  - Type is always set to "info" (mention any conditions where it could be something else)
  - Mention any other type of metadata fields included with this alert

- FORTA-2
  - Fired when a transaction has gas fee more than 10 USD.
  - Severity is set to "medium" if gas fee is above 10 USD, "high" if above 50 USD, and "Critical" if above 100 USD
  - Type is always Suspicious
  - Metadata "fee" field contains USD amount of fee

## Test Data

The agent behaviour can be verified with the following transactions:

- 0x3a0f757030beec55c22cbc545dd8a844cbbb2e6019461769e1bc3f3a95d10826 (15,000 USDT)
- 0xc3146d76031794154a96ccddb4a0fa065cef6cd9d81e9f59a9ab606f1d94f9cc (gas fee: 21.22 USD (medium severity))
