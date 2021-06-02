import BN from 'bn.js';
import { feeChannel } from './feeChannel';

jest.mock('./feeChannel');

export function mockFeeChannel(): void {
  (feeChannel.get as jest.Mock).mockResolvedValue(new BN('100000000000000'));
}
