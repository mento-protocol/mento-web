import Image from 'next/image'
import BackgroundTilesDark from 'src/images/background/background_tiles_dark.png'
import BackgroundTiles from 'src/images/background/background_tiles_light.png'

export function BottomGrid() {
  return (
    <div className="absolute bottom-0 z-10 w-screen transform -translate-x-1/2 left-1/2">
      <Image
        src={BackgroundTiles}
        alt="Background Tiles"
        quality={100}
        className="inline dark:hidden min-h-[201px] w-screen"
      />
      <Image
        src={BackgroundTilesDark}
        alt="Background Tiles"
        quality={100}
        className="hidden dark:inline min-h-[201px] w-screen"
      />
    </div>
  )
}
