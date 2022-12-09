import Link from 'next/link'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { IconButton } from 'src/components/buttons/IconButton'
import { navLinks } from 'src/components/nav/navLinks'
import Hamburger from 'src/images/icons/hamburger.svg'

export function DropdownNav({ align }: { align: 'l' | 'r' }) {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3)

  return (
    <div className="relative">
      <IconButton
        imgSrc={Hamburger}
        width={40}
        height={40}
        title="Menu"
        passThruProps={buttonProps}
      />
      <div
        className={`dropdown-menu bg-greengray-light ${isOpen ? '' : 'hidden'} ${
          align === 'l' ? '-left-1' : '-right-1'
        }`}
        role="menu"
      >
        <ul className="list-none">
          {navLinks.map((l, i) => (
            <li key={l.label} className="px-8 py-2">
              <Link
                href={l.to}
                className="group text-lg font-medium flex flex-col"
                {...itemProps[i]}
              >
                <div>{l.label}</div>
                <div className="rounded-lg bg-black h-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-all"></div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
