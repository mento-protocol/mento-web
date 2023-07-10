import Image from 'next/image'
import Blur from 'src/images/background/background_blur.svg'

export function TopBlur() {
  return (
    <div className="fixed z-0 w-screen transform -translate-x-1/2 left-1/2 top-6">
      <Image src={Blur} alt="Blur" quality={100} className="min-h-[252px] w-screen" />
    </div>
  )
}
