import { PropsWithChildren } from 'react'

type BaseButtonProps = {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  isError?: boolean
  isFullWidth?: boolean
  isDisabled?: boolean
  isWalletConnected?: boolean
  isBalanceLoaded?: boolean
}

export enum Button3DText {
  connectWallet = 'Connect Wallet',
  continue = 'Continue',
  balanceStillLoading = 'Balance still loading...',
  switchToCeloNetwork = 'Switch to Celo Network',
}

export const Button3D = ({
  children,
  onClick,
  type = 'button',
  isError,
  isFullWidth,
  isDisabled,
  isWalletConnected,
  isBalanceLoaded,
}: PropsWithChildren<BaseButtonProps>) => {
  return (
    <button
      className={isFullWidth ? 'w-full' : ''}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
    >
      <span
        className={`group font-inter outline-offset-4 cursor-pointer ${getShadowButtonColor({
          isDisabled,
          isWalletConnected,
          isError,
          isBalanceLoaded,
        })} ${
          isFullWidth ? 'w-full ' : ''
        } border-b rounded-lg border-primary-dark font-medium select-none inline-block`}
      >
        <span
          className={`pr-10 pl-10 group-active:-translate-y-[2px] block py-[18px] transition-transform delay-[250] hover:translate-y-[${
            isDisabled ? '-4px' : '6px'
          }] -translate-y-[4px] font-medium text-[15px] border rounded-lg border-primary-dark leading-5 ${getButtonColor(
            {
              isDisabled,
              isWalletConnected,
              isError,
              isBalanceLoaded,
            }
          )} ${isFullWidth ? 'w-full flex items-center justify-center' : ''} `}
        >
          <span className="flex items-center">{children}</span>
        </span>
      </span>
    </button>
  )
}

function getShadowButtonColor({
  isDisabled,
  isWalletConnected,
  isError,
  isBalanceLoaded,
}: IGetButtonColorArgs) {
  switch (true) {
    case isDisabled:
    case isWalletConnected && !isBalanceLoaded:
      return 'bg-[#666666]'
    case isError && isWalletConnected:
      return 'bg-[#863636]'
    default:
      return 'bg-[#2A326A]'
  }
}

function getButtonColor({
  isDisabled,
  isWalletConnected,
  isError,
  isBalanceLoaded,
}: IGetButtonColorArgs) {
  switch (true) {
    case isDisabled:
    case isWalletConnected && !isBalanceLoaded:
      return 'bg-[#888888] text-white cursor-not-allowed'
    case isError && isWalletConnected:
      return 'bg-[#E14F4F] text-white'
    default:
      return 'bg-[#4D62F0] text-white '
  }
}

interface IGetButtonColorArgs {
  isWalletConnected: boolean | undefined
  isBalanceLoaded: boolean | undefined
  isDisabled: boolean | undefined
  isError: boolean | undefined
}
