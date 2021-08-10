import { browser } from 'webextension-polyfill-ts';
import { toggleIcon } from './channels/toggleIconChannel/toggleIconChannel';
import { initContentIdentitiesChannel } from './dApps/identitiesDataProvider/identitiesDataProvider';
import { initContentAccessChannel } from './dApps/checkAccess/checkAccess';
import { initContentSignChannel } from './dApps/SignChannels/contentSignChannel';
import { initContentCredentialChannel } from './channels/CredentialChannels/contentCredentialChannel';

function injectScript() {
  // content scripts cannot expose APIs to website code, only injected scripts can
  const script = document.createElement('script');
  script.type = 'module';
  script.async = true;
  script.src = browser.runtime.getURL('js/injectedScript.js');
  document.head.appendChild(script);
}

function initMessages() {
  initContentCredentialChannel();

  const origin = window.location.href;
  initContentAccessChannel(origin);
  initContentIdentitiesChannel(origin);
  initContentSignChannel(origin);
}

function main() {
  injectScript();
  initMessages();
  toggleIcon();
}

main();
