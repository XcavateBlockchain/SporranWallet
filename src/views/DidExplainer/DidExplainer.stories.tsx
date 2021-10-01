import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { DidExplainer } from './DidExplainer';

export default {
  title: 'Views/DidExplainer',
  component: DidExplainer,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/did/upgrade',
      ]}
    >
      <Route path={paths.identity.did.start}>
        <DidExplainer
          identity={
            identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
