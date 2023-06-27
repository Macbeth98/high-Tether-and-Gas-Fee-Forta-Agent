// import BigNumber from "bignumber.js";
import { Finding, FindingSeverity, FindingType, TransactionEvent, ethers } from 'forta-agent';

import CryptoPriceGetter from './crypto.price.getter';
import PriceGetter from './dto/PriceGetter.dto';

const feeThresholds = {
  MEDIUM: 10,
  HIGH: 50,
  CRITICAL: 100,
};

const cryptoPriceGetter = new CryptoPriceGetter();

function getSeverity(feeUSD: number) {
  return feeUSD > feeThresholds.CRITICAL
    ? FindingSeverity.Critical
    : feeUSD > feeThresholds.HIGH
    ? FindingSeverity.High
    : FindingSeverity.Medium;
}

export function provideHandleTransaction(cryptoPriceGetter: PriceGetter) {
  return async function handleTransaction(txEvent: TransactionEvent, gasUsed: ethers.BigNumber) {
    const findings: Finding[] = [];

    const totalGasCostWei = gasUsed.mul(txEvent.gasPrice);
    const totalGasCost = ethers.utils.formatEther(totalGasCostWei);

    const priceUsd = await cryptoPriceGetter.getPrice();
    const totalFeeUSD = Number(totalGasCost) * priceUsd;

    if (totalFeeUSD < feeThresholds.MEDIUM) return findings;

    findings.push(
      Finding.fromObject({
        name: 'High Gas Fee (USD)',
        description: `Gas Fee: $${totalFeeUSD.toFixed(2)}`,
        alertId: 'FORTA-2',
        type: FindingType.Suspicious,
        severity: getSeverity(totalFeeUSD),
        metadata: {
          fee: totalFeeUSD.toFixed(2),
        },
      })
    );

    return findings;
  };
}

export const handleTransaction = provideHandleTransaction(cryptoPriceGetter);
