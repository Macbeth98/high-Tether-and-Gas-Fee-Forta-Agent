import { HandleTransaction, createTransactionEvent, ethers } from 'forta-agent';
import agent from './agent';

describe('High Gas and Tether Agent', () => {
  let handleTransaction: HandleTransaction;
  const mockHighGasFeeAgent = {
    handleTransaction: jest.fn(),
  };
  const mockHighTetherAgent = {
    handleTransaction: jest.fn(),
  };

  const mockGetTransactionReceipt = jest.fn();

  beforeAll(() => {
    handleTransaction = agent.provideHandleTransaction(
      mockHighGasFeeAgent,
      mockHighTetherAgent,
      mockGetTransactionReceipt
    );
  });

  describe('handleTransaction', () => {
    it('invokes highTetherAgent and highGasFeeAgent and retruns their findings', async () => {
      const mockFinding = { some: 'finding' };
      mockHighGasFeeAgent.handleTransaction.mockReturnValueOnce([mockFinding]);
      mockHighTetherAgent.handleTransaction.mockReturnValueOnce([mockFinding]);
      const mockGasUsed = '250000';
      mockGetTransactionReceipt.mockReturnValueOnce({ gasUsed: mockGasUsed });

      const mockTxEvent = createTransactionEvent({ transaction: { gas: mockGasUsed } } as any);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([mockFinding, mockFinding]);
      expect(mockHighGasFeeAgent.handleTransaction).toHaveBeenCalledTimes(1);
      expect(mockHighGasFeeAgent.handleTransaction).toHaveBeenCalledWith(
        mockTxEvent,
        ethers.BigNumber.from(mockGasUsed)
      );

      expect(mockHighTetherAgent.handleTransaction).toHaveBeenCalledTimes(1);
      expect(mockHighTetherAgent.handleTransaction).toHaveBeenCalledWith(mockTxEvent);
    });
  });
});
