import { useContractKit } from '@celo-tools/use-contractkit'
import Image from 'next/image'
import { PropsWithChildren, useEffect } from 'react'
import Modal from 'react-modal'
import { Footer } from 'src/components/nav/Footer'
import { Header } from 'src/components/nav/Header'
import { NULL_ADDRESS } from 'src/config/consts'
import { PollingWorker } from 'src/features/polling/PollingWorker'
import CeloIcon from 'src/images/tokens/CELO.svg'
import cEURIcon from 'src/images/tokens/cEUR.svg'
import cUSDIcon from 'src/images/tokens/cUSD.svg'
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
        <ImagePrefetch />
        <Footer />
        <PollingWorker />
      </div>
    </>
  )
}

// A hack to get Next to pre-fetch some images that may not yet be in dom tree
function ImagePrefetch() {
  return (
    <div className="hidden">
      <Image src={CeloIcon} width={1} height={1} alt="celo" />
      <Image src={cUSDIcon} width={1} height={1} alt="cUSD" />
      <Image src={cEURIcon} width={1} height={1} alt="cEUR" />
    </div>
  )
}
