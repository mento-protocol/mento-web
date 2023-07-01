import { PropsWithChildren } from 'react'
import { Footer } from 'src/components/nav/Footer'
import { Header } from 'src/components/nav/Header'
import { InfoBanner } from 'src/components/nav/InfoBanner'
import { PollingWorker } from 'src/features/polling/PollingWorker'
import { HeadMeta } from 'src/layout/HeadMeta'

interface Props {
  pathName: string
}

export function AppLayout({ pathName, children }: PropsWithChildren<Props>) {
  return (
    <>
      <HeadMeta pathName={pathName} />
      <div className="relative z-10 flex flex-col h-full min-h-screen w-full min-w-screen bg-gradient-linear">
        <InfoBanner />
        <Header pathName={pathName} />
        <main className="relative z-0 grow flex items-center justify-center">{children}</main>
        <Footer />
      </div>
      <PollingWorker />
    </>
  )
}
