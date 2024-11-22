import { PropsWithChildren } from 'react'

type BaseButtonProps = {
  onClick?: () => void
  error?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export const Button3D = ({ children, ...restProps }: PropsWithChildren<BaseButtonProps>) => {
  return <_3DButtonLink {...restProps}>{children}</_3DButtonLink>
}

const _3DButtonLink = ({
  children,
  error,
  fullWidth,
  onClick,
  type,
  disabled,
}: PropsWithChildren<BaseButtonProps>) => {
  return (
    <button
      className={fullWidth ? 'w-full' : ''}
      onClick={onClick}
      type={type ?? 'button'}
      disabled={disabled}
    >
      <span
        className={`group font-inter outline-offset-4 cursor-pointer ${
          disabled ? 'bg-[#666666]' : error ? 'bg-[#863636]' : 'bg-[#2A326A]'
        } ${
          fullWidth ? 'w-full ' : ''
        } border-b rounded-lg border-primary-dark font-medium select-none inline-block`}
      >
        <span
          className={`${'pr-10'} pl-10 group-active:-translate-y-[2px] block py-[18px] transition-transform delay-[250] ${
            disabled ? 'hover:translate-y-[-4px]' : 'hover:-translate-y-[6px]'
          } -translate-y-[4px] font-medium text-[15px] border rounded-lg border-primary-dark leading-5 ${
            disabled
              ? 'bg-[#888888] text-white cursor-not-allowed'
              : error
              ? 'bg-[#E14F4F] text-white'
              : 'bg-[#4D62F0] text-white '
          } ${fullWidth ? 'w-full flex items-center justify-center' : ''} `}
        >
          <span className="flex items-center">{children}</span>
        </span>
      </span>
    </button>
  )
}
