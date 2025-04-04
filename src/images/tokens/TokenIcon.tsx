import Image from 'next/image'
import { memo, useState } from 'react'
import { Token } from 'src/config/tokens'

interface Props {
  token?: Token | null
  size?: 'xs' | 's' | 'm' | 'l'
}

function TokenIconBase({ token, size = 'm' }: Props) {
  const { actualSize, fontSize } = sizeValues[size]
  const [imgError, setImgError] = useState(false)

  if (!token) {
    return (
      <div
        className="flex items-center justify-center bg-white border border-gray-200 rounded-full"
        style={{
          width: actualSize,
          height: actualSize,
        }}
      ></div>
    )
  }

  const imgSrc = `/tokens/${token.id}.svg`

  if (imgSrc && !imgError) {
    return (
      <Image
        src={imgSrc}
        alt=""
        width={actualSize}
        height={actualSize}
        priority={true}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: actualSize,
        height: actualSize,
        backgroundColor: token.color || '#9CA4A9',
      }}
    >
      <div
        className="font-semibold text-white"
        style={{
          fontSize,
        }}
      >
        {token.symbol[0].toUpperCase() + token.symbol[1].toUpperCase()}
      </div>
    </div>
  )
}

const sizeValues = {
  xs: {
    actualSize: 22,
    fontSize: '13px',
  },
  s: {
    actualSize: 30,
    fontSize: '15px',
  },
  m: {
    actualSize: 40,
    fontSize: '18px',
  },
  l: {
    actualSize: 46,
    fontSize: '20px',
  },
}

export const TokenIcon = memo(TokenIconBase)
