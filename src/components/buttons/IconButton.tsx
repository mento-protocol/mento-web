import Image from 'next/image'
import { PropsWithChildren } from 'react'

interface ButtonProps {
  width: number
  height: number
  classes?: string
  onClick?: () => void
  disabled?: boolean
  imgSrc?: any
  title?: string
  passThruProps?: any
}

export function IconButton(props: PropsWithChildren<ButtonProps>) {
  const { width, height, onClick, imgSrc, disabled, title, passThruProps } = props

  const base = 'flex items-center justify-center transition-all'
  const onHover = 'hover:opacity-70'
  const onDisabled = 'disabled:opacity-50'
  const onActive = 'active:opacity-60'
  const classes = `${base} ${onHover} ${onDisabled} ${onActive}`

  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled ?? false}
      title={title}
      className={classes}
      {...passThruProps}
    >
      <Image src={imgSrc} alt={title} width={width} height={height} />
    </button>
  )
}
