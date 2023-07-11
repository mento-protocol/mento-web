import { PropsWithChildren } from 'react'

interface Props {
  width?: string
  maxWidth?: string
  classes?: string
  padding?: string
}

export function FloatingBox(props: PropsWithChildren<Props>) {
  const { width, maxWidth, classes, padding = 'p-3' } = props
  return (
    <div
      style={{ maxHeight: '80%' }}
      className={`${width} ${maxWidth} ${padding}  bg-white shadow-md rounded-2xl overflow-auto ${classes}`}
    >
      {props.children}
    </div>
  )
}
