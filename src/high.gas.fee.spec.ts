import { createTransactionEvent, Finding, TransactionEvent, ethers } from 'forta-agent';

import { provideHandleTransaction } from './high.gas.fee';

describe('high gas fee agent', () => {
  let handleTransaction: (txEvent: TransactionEvent, gasUsed: ethers.BigNumber) => Promise<Finding[]>;
  const mockCryptoPriceGetter = {
    getPrice: jest.fn(),
  };

  beforeAll(async () => {
    handleTransaction = provideHandleTransaction(mockCryptoPriceGetter);
  });

  describe('handle Transaction', () => {
    it('returns empty findings if gas fee is below threshold', async () => {
      const mockGasUsed = '25000';
      const mockGasPrice = '1';
      const txEvent = createTransactionEvent({ transaction: { gasPrice: mockGasPrice } } as any);
      mockCryptoPriceGetter.getPrice.mockReturnValueOnce('1');

      const findings = await handleTransaction(txEvent, ethers.BigNumber.from(mockGasUsed));
      expect(mockCryptoPriceGetter.getPrice).toHaveBeenCalledTimes(1);
      expect(mockCryptoPriceGetter.getPrice).toHaveBeenCalledWith();
      expect(findings).toStrictEqual([]);
    });

    it('returns a finding if gas fee is above threshold', async () => {
      const mockGasUsed = '25000';
      const mockGasPrice = '170000000000';

      mockCryptoPriceGetter.getPrice.mockReset();
      mockCryptoPriceGetter.getPrice.mockReturnValueOnce(10000);

      const txEvent = createTransactionEvent({ transaction: { gasPrice: mockGasPrice } } as any);

      const findings = await handleTransaction(txEvent, ethers.BigNumber.from(mockGasUsed));

      expect(findings.length).toStrictEqual(1);
    });
  });
});
