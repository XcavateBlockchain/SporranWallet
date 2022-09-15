import { connect } from '@kiltprotocol/core';
import { getEndpoint } from '../endpoints/endpoints';

export async function initKiltSDK(): Promise<void> {
  const address = await getEndpoint();
  await connect(address);
}
