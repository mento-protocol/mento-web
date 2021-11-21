// Copied from https://github.com/MyCryptoHQ/MyCrypto/blob/master/src/vendor/inpage-metamask.js
// But updated to use newer packages

import LocalMessageDuplexStream from 'post-message-stream'
import { initProvider } from '@metamask/inpage-provider'

// Firefox Metamask Hack
// Due to https://github.com/MetaMask/metamask-extension/issues/3133
;(() => {
  if (
    typeof window !== 'undefined' &&
    !window.ethereum &&
    !window.web3 &&
    navigator.userAgent.includes('Firefox')
  ) {
    // setup background connection
    const metamaskStream = new LocalMessageDuplexStream({
      name: 'inpage',
      target: 'contentscript',
    })

    // this will initialize the provider and set it as window.ethereum
    initProvider({
      connectionStream: metamaskStream,
    })
  }
})()
