import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { AccountOptions } from '../AccountOptions/AccountOptions';
import { Account, saveAccount } from '../../utilities/accounts/accounts';
import { Avatar } from '../Avatar/Avatar';

import styles from './AccountSlide.module.css';

interface Props {
  account: Account;
}

export function AccountSlide({ account }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [editing, setEditing] = useState(false);

  const handleEditClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    setEditing(false);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const name = event.target.elements.name.value;
      await saveAccount({
        ...account,
        name,
      });

      setEditing(false);
    },
    [account],
  );

  return (
    <section>
      <Avatar tartan={account.tartan} address={account.address} />
      {!editing ? (
        <div className={styles.name}>
          <span>{account.name}</span>
          <AccountOptions address={account.address} onEdit={handleEditClick} />
          {/* TODO - https://kiltprotocol.atlassian.net/browse/SK-119 */}
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.inputLine}>
            <input
              className={styles.input}
              name="name"
              required
              aria-label={t('component_AccountSlide_name')}
              placeholder={account.name}
            />
            <span className={styles.pencil} />
          </p>
          <button
            className={styles.save}
            type="submit"
            aria-label={t('common_action_save')}
            title={t('common_action_save')}
          />
          <button
            className={styles.cancel}
            type="button"
            onClick={handleCancelClick}
            aria-label={t('common_action_cancel')}
            title={t('common_action_cancel')}
          />
        </form>
      )}
    </section>
  );
}
