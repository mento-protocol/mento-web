import Image from 'next/image'
import BackgroundTilesDark from 'src/images/background/background_tiles_dark.png'
import BackgroundTiles from 'src/images/background/background_tiles_light.png'

export function BottomGrid() {
  return (
    <div className="absolute bottom-0 z-10 transform -translate-x-1/2 left-1/2">
      <div className="w-screen h-[201px] relative">
        <Image
          src={BackgroundTiles}
          alt="Background Tiles"
          quality={100}
          fill={true}
          style={{ objectFit: 'cover' }}
          className="inline dark:hidden"
        />
        <Image
          src={BackgroundTilesDark}
          alt="Background Tiles"
          quality={100}
          fill={true}
          style={{ objectFit: 'cover' }}
          className="hidden dark:inline"
        />
      </div>
    </div>
  )
}
