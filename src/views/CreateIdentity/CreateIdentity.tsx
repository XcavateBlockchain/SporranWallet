import { useCallback, useMemo } from 'react';
import {
  generatePath,
  Route,
  Routes,
  Switch,
  useHistory,
} from 'react-router-dom';

import { mnemonicGenerate } from '@polkadot/util-crypto';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Warning } from '../Warning/Warning';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { createIdentity } from '../../utilities/identities/identities';
import { VerifyBackupPhrase } from '../VerifyBackupPhrase/VerifyBackupPhrase';
import { paths } from '../paths';

export function CreateIdentity(): JSX.Element {
  const backupPhrase = useMemo(() => mnemonicGenerate(), []);
  const history = useHistory();

  const onSuccess = useCallback(
    async (password: string) => {
      const { address } = await createIdentity(backupPhrase, password);

      history.push(
        generatePath(paths.identity.overview, { address, type: 'created' }),
      );
    },
    [backupPhrase, history],
  );

  return (
    <Routes>
      <Route path={paths.identity.create.start}>
        <Warning />
      </Route>
      <Route path={paths.identity.create.backup}>
        <SaveBackupPhrase backupPhrase={backupPhrase} />
      </Route>
      <Route path={paths.identity.create.verify}>
        <VerifyBackupPhrase backupPhrase={backupPhrase} />
      </Route>
      <Route path={paths.identity.create.password}>
        <CreatePassword onSuccess={onSuccess} />
      </Route>
    </Routes>
  );
}
