import Image from 'next/image'
import Link from 'next/link'
import { ConnectButton } from 'src/components/nav/ConnectButton'
import { NavBar } from 'src/components/nav/NavBar'
import Glyph from 'src/images/logos/mento-glyph-black.svg'
import Logo from 'src/images/logos/mento-logo-black.svg'

export function Header({ pathName }: { pathName: string }) {
  return (
    <header className="w-screen py-5 px-3 sm:pl-5 sm:pr-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center sm:hidden">
          <Image src={Glyph} alt="" quality={100} width={40} />
        </Link>
        <Link href="/" className="hidden sm:flex items-center">
          <Image src={Logo} alt="Mento" quality={100} width={140} />
        </Link>
        <NavBar pathName={pathName} />
        <ConnectButton />
      </div>
    </header>
  )
}
