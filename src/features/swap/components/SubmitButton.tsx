import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useFormikContext } from 'formik'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Button3D, Button3DText } from 'src/components/buttons/3DButton'
import { reset as accountReset } from 'src/features/accounts/accountSlice'
import { reset as blockReset } from 'src/features/blocks/blockSlice'
import { resetTokenPrices } from 'src/features/chart/tokenPriceSlice'
import { useAppDispatch } from 'src/features/store/hooks'
import { reset as swapReset } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import { logger } from 'src/utils/logger'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface ISubmitButtonProps {
  isWalletConnected: boolean | undefined
  isBalanceLoaded: boolean | undefined
}

export function SubmitButton({ isWalletConnected, isBalanceLoaded }: ISubmitButtonProps) {
  const { chain, chains } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { openConnectModal } = useConnectModal()
  const dispatch = useAppDispatch()
  const { errors, touched, values, isSubmitting } = useFormikContext<SwapFormValues>()

  const switchToNetwork = useCallback(async () => {
    try {
      if (!switchNetworkAsync) throw new Error('switchNetworkAsync undefined')
      logger.debug('Resetting and switching to Celo')
      await switchNetworkAsync(42220)
      dispatch(blockReset())
      dispatch(accountReset())
      dispatch(swapReset())
      dispatch(resetTokenPrices())
    } catch (error) {
      logger.error('Error updating network', error)
      toast.error('Could not switch network, does wallet support switching?')
    }
  }, [switchNetworkAsync, dispatch])

  const isOnCelo = chains.some((chn) => chn.id === chain?.id)

  const isAmountModified = useMemo(
    () => touched.amount || values.amount,
    [touched.amount, values.amount]
  )

  const isQuoteStillLoading = useMemo(
    () => values.amount && values?.quote && errors.amount === 'Amount Required',
    [values.amount, values.quote, errors.amount]
  )

  const hasError = useMemo(() => {
    if (!isAmountModified) return false
    if (isQuoteStillLoading) return false
    return !!(
      errors.amount ||
      errors.quote ||
      errors.fromTokenId ||
      errors.toTokenId ||
      errors.slippage
    )
  }, [isAmountModified, isQuoteStillLoading, errors])

  const errorText = useMemo(
    () =>
      errors.amount ||
      errors.quote ||
      errors.fromTokenId ||
      errors.toTokenId ||
      errors.slippage ||
      '',
    [errors]
  )

  const buttonType = useMemo(
    () => (isWalletConnected && !hasError ? 'submit' : 'button'),
    [isWalletConnected, hasError]
  )

  const buttonText = useMemo(() => {
    if (!isWalletConnected) return Button3DText.connectWallet
    if (!isOnCelo) return Button3DText.switchToCeloNetwork
    if (isWalletConnected && !isBalanceLoaded) return Button3DText.balanceStillLoading
    if (hasError) return errorText
    if (isSubmitting) return 'Loading...'
    return Button3DText.continue
  }, [errorText, hasError, isWalletConnected, isOnCelo, isBalanceLoaded, isSubmitting])

  const onClick = useMemo(() => {
    if (!isWalletConnected) return openConnectModal
    if (!isOnCelo) return switchToNetwork
    return undefined
  }, [isWalletConnected, isOnCelo, openConnectModal, switchToNetwork])

  const isDisabled = useMemo(() => {
    if (!isWalletConnected || hasError) return false
    if (buttonText === Button3DText.balanceStillLoading) return true
    if (isSubmitting) return true
    return !Number(values.quote)
  }, [isWalletConnected, hasError, buttonText, values.quote, isSubmitting])

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Button3D
        isDisabled={isDisabled}
        isError={hasError}
        isFullWidth
        onClick={onClick}
        type={buttonType}
        isWalletConnected={isWalletConnected}
        isBalanceLoaded={isBalanceLoaded}
      >
        {buttonText}
      </Button3D>
    </div>
  )
}
