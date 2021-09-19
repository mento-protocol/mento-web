import Image from 'next/image'
import Link from 'next/link'
import { BorderedButton } from 'src/components/buttons/BorderedButton'
import { DropdownNav } from 'src/components/nav/DropdownNav'
import { navLinks } from 'src/components/nav/navLinks'
import Logo from 'src/images/logo.svg'

export function Header({ pathName }: { pathName: string }) {
  return (
    <header className="w-screen py-5 px-7">
      <div className="flex items-center justify-between">
        <div className="hidden md:block">
          <Link href="/">
            <a className="flex items-center w-52">
              <Image src={Logo} alt="Mento.fi Logo" quality={100} width={50} height={50} />
              <div className="ml-3 text-xl">Mento.fi</div>
            </a>
          </Link>
        </div>
        <nav>
          <div className="md:hidden">
            <DropdownNav align="l" />
          </div>
          <ul className="hidden md:flex list-none">
            {navLinks.map((l) => (
              <li key={l.label} className="px-6">
                <Link href={l.to}>
                  <a className="group text-xl font-medium flex flex-col">
                    <div>{l.label}</div>
                    <div
                      className={`rounded-lg bg-black h-0.5 mt-1 ${
                        pathName.includes(l.to) ? 'opacity-100' : 'opacity-0'
                      } group-hover:opacity-100 transition-all`}
                    ></div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex justify-end w-60">
          <BorderedButton size="l">Connect Wallet</BorderedButton>
        </div>
      </div>
    </header>
  )
}
