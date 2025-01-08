import { PropsWithChildren } from 'react'

type BaseButtonProps = {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  isError?: boolean
  isFullWidth?: boolean
  isDisabled?: boolean
  isAccountReady?: boolean
  isBalanceLoaded?: boolean
}

export const Button3D = ({ children, ...restProps }: PropsWithChildren<BaseButtonProps>) => {
  return <_3DButtonLink {...restProps}>{children}</_3DButtonLink>
}

const _3DButtonLink = (props: PropsWithChildren<BaseButtonProps>) => {
  const {
    children,
    onClick,
    type = 'button',
    isError,
    isFullWidth,
    isDisabled,
    isAccountReady,
    isBalanceLoaded,
  } = props
  return (
    <button
      className={isFullWidth ? 'w-full' : ''}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
    >
      <span
        className={`group font-inter outline-offset-4 cursor-pointer ${
          isDisabled || (isAccountReady && !isBalanceLoaded)
            ? 'bg-[#666666]'
            : isError && isAccountReady
            ? 'bg-[#863636]'
            : 'bg-[#2A326A]'
        } ${
          isFullWidth ? 'w-full ' : ''
        } border-b rounded-lg border-primary-dark font-medium select-none inline-block`}
      >
        <span
          className={`pr-10 pl-10 group-active:-translate-y-[2px] block py-[18px] transition-transform delay-[250] ${
            isDisabled ? 'hover:translate-y-[-4px]' : 'hover:-translate-y-[6px]'
          } -translate-y-[4px] font-medium text-[15px] border rounded-lg border-primary-dark leading-5 ${
            isDisabled || (isAccountReady && !isBalanceLoaded)
              ? 'bg-[#888888] text-white cursor-not-allowed'
              : isError && isAccountReady
              ? 'bg-[#E14F4F] text-white'
              : 'bg-[#4D62F0] text-white '
          } ${isFullWidth ? 'w-full flex items-center justify-center' : ''} `}
        >
          <span className="flex items-center">{children}</span>
        </span>
      </span>
    </button>
  )
}
