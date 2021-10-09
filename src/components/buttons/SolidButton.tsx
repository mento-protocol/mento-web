import { PropsWithChildren, ReactElement } from 'react'

interface ButtonProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
  type?: 'submit' | 'reset' | 'button'
  onClick?: () => void
  dark?: boolean // defaults to false
  classes?: string
  bold?: boolean
  disabled?: boolean
  icon?: ReactElement
  title?: string
  passThruProps?: any
}

export function SolidButton(props: PropsWithChildren<ButtonProps>) {
  const { size, type, onClick, dark, classes, bold, icon, disabled, title, passThruProps } = props

  const base = 'flex items-center justify-center rounded-full transition-all duration-300'
  const sizing = sizeToClasses(size)
  const colors = dark ? 'bg-green text-white' : 'bg-white text-black'
  const onHover = dark ? 'hover:bg-green-dark' : 'hover:bg-gray-50'
  const onDisabled = 'disabled:bg-gray-300 disabled:text-gray-300'
  const onActive = dark ? 'active:bg-green-darkest' : 'active:bg-gray-100'
  const weight = bold ? 'font-semibold' : ''
  const allClasses = `${base} ${sizing} ${colors} ${onHover} ${onDisabled} ${onActive} ${weight} ${classes}`

  return (
    <button
      onClick={onClick}
      type={type ?? 'button'}
      disabled={disabled ?? false}
      title={title}
      className={allClasses}
      {...passThruProps}
    >
      {icon ? (
        <div className="flex items-center justify-center">
          {props.icon}
          {props.children}
        </div>
      ) : (
        <>{props.children}</>
      )}
    </button>
  )
}

function sizeToClasses(size?: string) {
  if (size === 'xs') return 'h-7 px-4 py-1'
  if (size === 's') return 'h-7 px-4 py-1'
  if (size === 'l') return 'h-10 px-5 py-1 text-lg'
  if (size === 'xl') return 'w-40 h-11 px-5 py-1.5 text-xl'
  return 'px-5 py-1 h-9'
}
