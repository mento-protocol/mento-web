import Image from 'next/image'
import Link from 'next/link'
import { ConnectButton } from 'src/components/nav/ConnectButton'
import { NavBar } from 'src/components/nav/NavBar'
import Logo from 'src/images/logo.svg'

export function Header({ pathName }: { pathName: string }) {
  return (
    <header className="w-screen py-5 px-3 sm:pl-5 sm:pr-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center">
            <div className="flex scale-90 sm:scale-100">
              <Image src={Logo} alt="Mento.fi Logo" quality={100} width={50} height={50} />
            </div>
            <div className="hidden sm:block flex flex-col ml-3">
              <h1 style={{ letterSpacing: '0.1rem' }} className="text-xl text-medium">
                Mento-Fi
              </h1>
              <h2 className="text-sm text-gray-500">Celo Exchange</h2>
            </div>
          </a>
        </Link>
        <NavBar pathName={pathName} />
        <ConnectButton />
      </div>
    </header>
  )
}
