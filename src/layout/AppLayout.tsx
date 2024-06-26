import localFont from 'next/font/local'
import { PropsWithChildren } from 'react'
import { BottomGrid } from 'src/components/nav/BottomGrid'
import { Footer } from 'src/components/nav/Footer'
import { Header } from 'src/components/nav/Header'
import { TopBlur } from 'src/components/nav/TopBlur'
import { PollingWorker } from 'src/features/polling/PollingWorker'
import { HeadMeta } from 'src/layout/HeadMeta'

interface Props {
  pathName: string
}

const foundersGrotesk = localFont({
  src: '../../public/fonts/founders-grotesk-medium.woff2',
  variable: '--font-founders-grotesk',
})

export function AppLayout({ pathName, children }: PropsWithChildren<Props>) {
  return (
    <>
      <HeadMeta pathName={pathName} />
      <div
        className={`flex flex-col w-full h-full min-h-screen min-w-screen bg-white dark:bg-primary-dark font-inter ${foundersGrotesk.variable}`}
      >
        <TopBlur />
        <Header />
        <main className={`relative z-30 flex items-center justify-center grow`}>{children}</main>
        <Footer />
        <BottomGrid />
      </div>
      <PollingWorker />
    </>
  )
}
