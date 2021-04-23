import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, useParams, useRouteMatch, Redirect } from 'react-router-dom';

import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { Balance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { SuccessAccountOverlay } from '../../components/SuccessAccountOverlay/SuccessAcountOverlay';
import { Account, isNew, useAccounts } from '../../utilities/accounts/accounts';
import { plural } from '../../utilities/plural/plural';
import { generatePath, paths } from '../paths';
import { AccountOverviewNew } from './AccountOverviewNew';

import styles from './AccountOverview.module.css';

interface Props {
  account: Account;
}

export function AccountOverview({ account }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();
  const params = useParams() as { type?: 'created' | 'imported' | 'reset' };

  const [hasOpenOverlay, setOpenOverlay] = useState(Boolean(params.type));
  const [type] = useState(params.type);

  const closeOverlayHandler = useCallback(() => {
    setOpenOverlay(false);
  }, []);

  const accounts = useAccounts().data;
  if (!accounts) {
    return null;
  }

  const accountsNumber = Object.values(accounts).length;
  const { address } = account;

  if (params.type) {
    return <Redirect to={generatePath(paths.account.overview, { address })} />;
  }

  if (isNew(account)) {
    return <AccountOverviewNew />;
  }

  return (
    <main className={styles.container}>
      <header>
        <h1 className={styles.heading}>{t('view_AccountOverview_title')}</h1>
        <p className={styles.info}>
          {plural(accountsNumber, {
            one: 'view_AccountOverview_subtitle_one',
            other: 'view_AccountOverview_subtitle_other',
          })}
        </p>
      </header>

      <AccountsCarousel path={path} account={account} />

      <Balance address={address} />

      <p>
        <Link
          to={generatePath(paths.account.send, { address })}
          className={styles.button}
        >
          {t('view_AccountOverview_send')}
        </Link>

        <Link
          to={generatePath(paths.account.receive, {
            address,
          })}
          className={styles.button}
        >
          {t('view_AccountOverview_receive')}
        </Link>
      </p>

      <Stats />
      {hasOpenOverlay && type && (
        <SuccessAccountOverlay
          successType={type}
          account={account}
          closeOverlayHandler={closeOverlayHandler}
        />
      )}
    </main>
  );
}
