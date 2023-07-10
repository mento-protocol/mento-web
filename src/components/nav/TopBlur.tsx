import Image from 'next/image'
import Blur from 'src/images/background/background_blur.svg'

export function TopBlur() {
  return (
    <div className="fixed top-0 z-0 w-screen">
      <picture>
        <source media="(min-width: 640px)" srcSet={Blur.src} />
        <Image src={Blur} alt="Blur" quality={100} className="w-screen h-[150px] md:h-[252px]" />
      </picture>
    </div>
  )
}
