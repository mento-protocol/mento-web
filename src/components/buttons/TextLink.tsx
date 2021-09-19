import { PropsWithChildren } from 'react'

interface Props {
  href: string
  className?: string
}

export function TextLink(props: PropsWithChildren<Props>) {
  const { href, className } = props

  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  )
}
