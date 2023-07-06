import { ReactNode } from 'react'

type BaseButtonProps = {
  children: ReactNode
  onClick?: () => void
  color: 'red' | 'blue'
  fullWidth?: boolean
}

export const Blue3DButton = ({ children, ...restProps }: Omit<BaseButtonProps, 'color'>) => {
  return (
    <_3DButtonLink color="blue" {...restProps}>
      {children}
    </_3DButtonLink>
  )
}

const _3DButtonLink = ({ children, color = 'blue', fullWidth, onClick }: BaseButtonProps) => {
  return (
    <button className={fullWidth ? 'w-full' : ''} onClick={onClick}>
      <span
        className={`group font-inter outline-offset-4 cursor-pointer  ${
          color === 'blue' ? 'bg-[#2A326A]' : 'bg-[#845F84]'
        } ${
          fullWidth ? 'w-full ' : ''
        } border-b rounded-lg border-primary-dark font-medium select-none inline-block`}
      >
        <span
          className={`${'pr-10'} pl-10 group-active:-translate-y-[2px] block py-[18px] transition-transform delay-[250] hover:-translate-y-[6px] -translate-y-[4px] font-medium text-[15px] border rounded-lg border-primary-dark leading-5 ${
            color === 'blue'
              ? 'bg-[#4D62F0] text-clean-white '
              : 'bg-primary-blush text-primary-dark'
          } ${fullWidth ? 'w-full flex items-center justify-center' : ''} `}
        >
          <span className={`flex items-center `}>{children}</span>
        </span>
      </span>
    </button>
  )
}
