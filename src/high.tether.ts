import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent } from 'forta-agent';

export const ERC20_TRANSFER_EVENT = 'event Transfer(address indexed from, address indexed to, uint256 value)';
export const TETHER_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
export const TETHER_DECIMALS = 6;
// let findingsCount = 0;

export const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  // if (findingsCount >= 5) return findings;

  // filter the transaction logs for Tether transfer events
  const tetherTransferEvents = txEvent.filterLog(ERC20_TRANSFER_EVENT, TETHER_ADDRESS);

  tetherTransferEvents.forEach((transferEvent) => {
    // extract transfer event arguments
    const { to, from, value } = transferEvent.args;
    // shift decimals of transfer value
    const normalizedValue = value.div(10 ** TETHER_DECIMALS);

    // if more than 10,000 Tether were transferred, report it
    if (normalizedValue.gt(10000)) {
      findings.push(
        Finding.fromObject({
          name: 'High Tether Transfer',
          description: `High amount of USDT transferred: ${normalizedValue}`,
          alertId: 'FORTA-1',
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            to,
            from,
          },
        })
      );
      // findingsCount++;
    }
  });

  return findings;
};

export default {
  handleTransaction,
};
