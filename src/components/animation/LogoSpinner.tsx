import Image from 'next/image'
import { memo } from 'react'
import Logo from 'src/images/logo.svg'

function _LogoSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={Logo}
        alt="Mento.fi Logo"
        quality={100}
        width={50}
        height={50}
        className="rotate-scale-up"
      />
    </div>
  )
}

export const LogoSpinner = memo(_LogoSpinner)
