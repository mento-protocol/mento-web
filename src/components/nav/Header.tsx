import Image from 'next/image'
import Link from 'next/link'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { NavBar } from 'src/components/nav/NavBar'
import Wallet from 'src/images/icons/wallet.svg'
import Logo from 'src/images/logo.svg'

export function Header({ pathName }: { pathName: string }) {
  return (
    <header className="w-screen py-5 px-7">
      <div className="flex items-center justify-between">
        <div className="hidden md:block">
          <Link href="/">
            <a className="flex items-center w-52">
              <Image src={Logo} alt="Mento.fi Logo" quality={100} width={50} height={50} />
              <div className="flex flex-col ml-3">
                <h1 className="text-xl">Mento</h1>
                <h2 className="text-base text-gray-500">Celo Exchange</h2>
              </div>
            </a>
          </Link>
        </div>
        {/* <div className="md:hidden">
            <DropdownNav align="l" />
          </div> */}
        <NavBar pathName={pathName} />
        <div className="flex justify-end w-60">
          <SolidButton size="l" classes="shadow-md" icon={<WalletIcon />}>
            Connect
          </SolidButton>
        </div>
      </div>
    </header>
  )
}

function WalletIcon() {
  return (
    <div className="flex items-center mr-2">
      <Image src={Wallet} alt="Wallet" width={18} height={18} />
    </div>
  )
}
