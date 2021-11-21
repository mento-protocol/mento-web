import { useContractKit } from '@celo-tools/use-contractkit'
import { PropsWithChildren, useEffect } from 'react'
import Modal from 'react-modal'
import { Footer } from 'src/components/nav/Footer'
import { Header } from 'src/components/nav/Header'
import { NULL_ADDRESS } from 'src/config/consts'
import { PollingWorker } from 'src/features/polling/PollingWorker'
import { HeadMeta } from 'src/layout/HeadMeta'

interface Props {
  pathName: string
}

export function AppLayout({ pathName, children }: PropsWithChildren<Props>) {
  // Prevent react-modal from showing aria related error
  // Note react-modal not used directly, it's part of use-contractkit
  useEffect(() => {
    Modal.setAppElement('#__next')
  }, [])

  // Prevent web3 from spamming errors due to missing ENS on Celo
  // Error: https://github.com/ChainSafe/web3.js/blob/1.x/packages/web3-eth-ens/src/ENS.js#L526
  // Related: https://github.com/ChainSafe/web3.js/issues/3787
  // Related: https://github.com/ChainSafe/web3.js/issues/3010
  const { kit } = useContractKit()
  useEffect(() => {
    kit.web3.eth.ens.registryAddress = NULL_ADDRESS
  }, [kit])

  return (
    <>
      <HeadMeta pathName={pathName} />
      <div
        className={`flex flex-col justify-between h-full min-h-screen w-full min-w-screen bg-gradient-radial`}
      >
        <Header pathName={pathName} />
        <main className="w-full">{children}</main>
        <Footer />
        <PollingWorker />
      </div>
    </>
  )
}
