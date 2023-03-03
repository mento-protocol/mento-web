import { PropsWithChildren, useEffect } from 'react'
import Modal from 'react-modal'
import { Footer } from 'src/components/nav/Footer'
import { Header } from 'src/components/nav/Header'
import { PollingWorker } from 'src/features/polling/PollingWorker'
import { HeadMeta } from 'src/layout/HeadMeta'

interface Props {
  pathName: string
}

export function AppLayout({ pathName, children }: PropsWithChildren<Props>) {
  // Prevent react-modal from showing aria related error
  // Note react-modal not used directly, it's part of use-contractkit
  // TODO remove react-modal
  useEffect(() => {
    Modal.setAppElement('#__next')
  }, [])

  return (
    <>
      <HeadMeta pathName={pathName} />
      <div className="flex flex-col h-full min-h-screen w-full min-w-screen bg-gradient-linear">
        {/* <InfoBanner /> */}
        <Header pathName={pathName} />
        <main className="grow flex items-center justify-center">{children}</main>
        <Footer />
      </div>
      <PollingWorker />
    </>
  )
}
