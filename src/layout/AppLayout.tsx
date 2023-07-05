import { PropsWithChildren } from 'react'
import { BottomGrid } from 'src/components/nav/BottomGrid'
import { Footer } from 'src/components/nav/Footer'
import { Header } from 'src/components/nav/Header'
import { InfoBanner } from 'src/components/nav/InfoBanner'
import { TopBlur } from 'src/components/nav/TopBlur'
import { PollingWorker } from 'src/features/polling/PollingWorker'
import { HeadMeta } from 'src/layout/HeadMeta'

interface Props {
  pathName: string
}

export function AppLayout({ pathName, children }: PropsWithChildren<Props>) {
  return (
    <>
      <HeadMeta pathName={pathName} />
      <div className="flex flex-col w-full h-full min-h-screen min-w-screen bg-clean-white dark:bg-primary-dark font-fg">
        <InfoBanner />
        <TopBlur />
        <Header />
        <main className="relative z-20 flex items-center justify-center grow">{children}</main>
        <Footer />
        <BottomGrid />
      </div>
      <PollingWorker />
    </>
  )
}
