import Image from 'next/image'
import { memo } from 'react'
import Glyph from 'src/images/logos/mento-glyph-green.svg'

function _LogoSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Image src={Glyph} alt="" quality={100} width={50} height={50} className="rotate-scale-up" />
    </div>
  )
}

export const LogoSpinner = memo(_LogoSpinner)
