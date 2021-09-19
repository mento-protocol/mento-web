import { PropsWithChildren } from 'react'
import { Footer } from 'src/components/nav/Footer'
import { Header } from 'src/components/nav/Header'
import { HeadMeta } from 'src/layout/HeadMeta'

interface Props {
  pathName: string
}

export function AppLayout({ pathName, children }: PropsWithChildren<Props>) {
  return (
    <>
      <HeadMeta pathName={pathName} />
      <div className={`flex flex-col justify-between h-screen bg-gradient-radial`}>
        <Header pathName={pathName} />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </div>
    </>
  )
}
