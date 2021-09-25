import Link from 'next/link'
import { navLinks } from 'src/components/nav/navLinks'

export function NavBar({ pathName }: { pathName: string }) {
  return (
    <nav>
      <ul className="flex items-center justify-center list-none rounded-full bg-white shadow-md overflow-hidden opacity-90">
        {navLinks.map((l) => {
          const active = pathName.includes(l.to)
          return (
            <li key={l.label} className="flex">
              <Link href={l.to}>
                <a
                  className={`py-1.5 px-6 first:pl-7 last:pr-7 ${
                    active && 'bg-gray-100'
                  } hover:bg-gray-50 text-lg ${active ? 'font-medium' : 'font-base'}`}
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
