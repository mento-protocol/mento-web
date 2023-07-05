import Image from 'next/image'
import Blur from 'src/images/background/background_blur.svg'

export function TopBlur() {
  return (
    <div className="absolute z-0 transform -translate-x-1/2 left-1/2 top-6">
      <Image src={Blur} alt="Blur" quality={100} className="min-h-[252px] min-w-[1440px]" />
    </div>
  )
}