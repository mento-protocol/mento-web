import Image from 'next/image'
import Blur from 'src/images/background/background_blur.svg'
import BlurDark from 'src/images/background/background_blur_dark.svg'

export function TopBlur() {
  return (
    <div className="fixed top-0 z-0 w-screen">
      <picture>
        <Image
          src={Blur}
          alt="Blur"
          quality={100}
          className="w-screen h-[150px] md:h-[252px] inline dark:hidden"
        />
        <Image
          src={BlurDark}
          alt="Dark Blur"
          quality={100}
          className="w-screen h-[150px] md:h-[252px] hidden dark:inline"
        />
      </picture>
    </div>
  )
}
