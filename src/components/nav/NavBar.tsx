import Link from 'next/link'
import { navLinks } from 'src/components/nav/navLinks'

export function NavBar({ pathName }: { pathName: string }) {
  return (
    <nav>
      <ul className="flex items-center justify-center list-none rounded-full bg-white shadow-md overflow-hidden opacity-90 mr-3">
        {navLinks.map((l, i) => {
          const active = pathName === l.to
          return (
            <li key={l.label} className="flex items-center justify-center">
              <Link href={l.to}>
                <a
                  className={`py-1.5 px-3 md:px-5 ${i === 0 && 'pl-4 md:pl-6'} ${
                    i === navLinks.length - 1 && 'pr-4 md:pr-6'
                  } ${active && 'bg-gray-100'} hover:bg-gray-50 text-lg ${
                    active ? 'font-medium' : 'font-base'
                  }`}
                >
                  {l.label}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
