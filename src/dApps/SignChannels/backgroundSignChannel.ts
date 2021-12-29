import type {
  ExtrinsicEra,
  ExtrinsicPayload,
} from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { map, zip } from 'lodash-es';
import { Runtime } from 'webextension-polyfill-ts';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { KeyringPair } from '@polkadot/keyring/types';
import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';

import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { decryptIdentity } from '../../utilities/identities/identities';

import { contentSignChannel } from './contentSignChannel';

interface SignBgInput {
  origin: string;
  address: string;
  specVersion: number;
  nonce: number;
  method: string;
  lifetimeStart?: number;
  lifetimeEnd?: number;
}

type SignBgOutput = string;

export const backgroundSignChannel = new PopupChannel<
  SignBgInput,
  SignBgOutput
>('sign');

async function getExtrinsic(input: SignerPayloadJSON) {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  api.registry.setSignedExtensions(input.signedExtensions);

  const params = { version: input.version };
  return api.registry.createType('ExtrinsicPayload', input, params);
}

async function getMethodText(methodSource: string) {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const call = api.registry.createType('Call', methodSource);

  const { section, method, meta } = call;

  const argumentValues = call.toHuman().args as unknown[];
  const argumentNames = meta && map(meta.args, 'name');
  const nameValuePairs = meta && zip(argumentNames, argumentValues);

  const methodSignature = meta
    ? `(${nameValuePairs
        .map(([name, value]) => `${name} = ${JSON.stringify(value)}`)
        .join(', ')})`
    : '';

  return `${section}.${method}${methodSignature}`;
}

function getLifetime({ era }: { era: ExtrinsicEra }, hexBlockNumber: string) {
  const blockNumber = new BN(hexBlockNumber.substring(2), 16);
  return (
    !era.isImmortalEra && {
      lifetimeStart: era.asMortalEra.birth(blockNumber),
      lifetimeEnd: era.asMortalEra.death(blockNumber),
    }
  );
}

let id = 0;

function signExtrinsic(extrinsic: ExtrinsicPayload, keypair: KeyringPair) {
  const { signature } = extrinsic.sign(keypair);

  id += 1;
  return { signature, id };
}

async function getSignature(
  input: Parameters<typeof contentSignChannel.get>[0],
  sender: Runtime.MessageSender,
) {
  const { origin, address, genesisHash } = input;

  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const sameBlockchain = genesisHash === api.genesisHash.toString();
  if (!sameBlockchain) {
    throw new Error(`Wrong blockchain: genesisHash not equal "${genesisHash}"`);
  }

  const extrinsic = await getExtrinsic(input);
  const method = await getMethodText(input.method);
  const lifetime = getLifetime(extrinsic, input.blockNumber);

  const values = {
    origin,
    address,
    specVersion: extrinsic.specVersion.toNumber(),
    nonce: extrinsic.nonce.toNumber(),
    method,
    ...lifetime,
  };

  const password = await backgroundSignChannel.get(values, sender);
  return signExtrinsic(extrinsic, await decryptIdentity(address, password));
}

export function initBackgroundSignChannel(): void {
  contentSignChannel.produce(getSignature);
}
