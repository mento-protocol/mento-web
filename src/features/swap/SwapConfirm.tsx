import Lottie from 'lottie-react'
import { SVGProps, useEffect, useState } from 'react'
import mentoLoaderBlue from 'src/animations/Mentoloader_blue.json'
import mentoLoaderGreen from 'src/animations/Mentoloader_green.json'
import { toastToYourSuccess } from 'src/components/TxSuccessToast'
import { Button3D } from 'src/components/buttons/3DButton'
import { Tooltip } from 'src/components/tooltip/Tooltip'
import { TokenId, Tokens } from 'src/config/tokens'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { FloatingBox } from 'src/layout/FloatingBox'
import { Modal } from 'src/layout/Modal'
import { fromWeiRounded, getAdjustedAmount, toSignificant } from 'src/utils/amount'
import { logger } from 'src/utils/logger'
import { truncateTextByLength } from 'src/utils/string'
import { useAccount, useChainId } from 'wagmi'

import { useApproveTransaction } from './hooks/useApproveTransaction'
import { useSwapAllowance } from './hooks/useSwapAllowance'
import { useSwapQuote } from './hooks/useSwapQuote'
import { useSwapState } from './hooks/useSwapState'
import { useSwapTransaction } from './hooks/useSwapTransaction'
import { setConfirmView, setFormValues } from './swapSlice'
import type { SwapFormValues } from './types'
import { getMaxSellAmount, getMinBuyAmount } from './utils'

interface Props {
  formValues: SwapFormValues
}

export function SwapConfirmCard({ formValues }: Props) {
  const { amount, direction, fromTokenId, toTokenId, slippage } = formValues

  // Flag for if loading modal is open (visible)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  const dispatch = useAppDispatch()
  const balances = useAppSelector((s) => s.account.balances)

  // Ensure invariants are met, otherwise return to swap form
  const isConfirmValid = amount && fromTokenId && toTokenId && address && isConnected
  useEffect(() => {
    if (!isConfirmValid) dispatch(setFormValues(null))
  }, [isConfirmValid, dispatch])

  const { amountWei, quote, quoteWei, rate, refetch } = useSwapQuote(
    amount,
    direction,
    fromTokenId,
    toTokenId
  )

  // Assemble values based on swap direction
  let fromAmount: string,
    fromAmountWei: string,
    toAmount: string,
    toAmountWei: string,
    thresholdAmount: string,
    thresholdAmountWei: string,
    approveAmount: string

  if (direction === 'in') {
    fromAmount = amount.toString()
    fromAmountWei = amountWei
    toAmount = quote
    toAmountWei = quoteWei
    // Check if amount is almost equal to balance max, in which case use max
    // Helps handle problems from imprecision in non-wei amount display
    fromAmountWei = getAdjustedAmount(fromAmountWei, balances[fromTokenId]).toFixed(0)
    // Compute min buy amount based on slippage
    thresholdAmountWei = getMinBuyAmount(toAmountWei, slippage).toFixed(0)
    thresholdAmount = fromWeiRounded(thresholdAmountWei, Tokens[toTokenId].decimals, true)
    // Approve amount is equal to amount being sold
    approveAmount = fromAmountWei
  } else {
    fromAmount = quote
    fromAmountWei = quoteWei
    toAmount = amount.toString()
    toAmountWei = amountWei
    // Compute max sell amount based on slippage
    thresholdAmountWei = getMaxSellAmount(fromAmountWei, slippage).toFixed(0)
    thresholdAmount = fromWeiRounded(thresholdAmountWei, Tokens[fromTokenId].decimals, true)
    // Approve amount is equal to max sell amount
    approveAmount = thresholdAmountWei
  }

  const { sendApproveTx, isApproveTxSuccess, isApproveTxLoading } = useApproveTransaction(
    chainId,
    fromTokenId,
    toTokenId,
    approveAmount,
    address
  )
  const [isApproveConfirmed, setApproveConfirmed] = useState(false)

  const { skipApprove, isAllowanceLoading } = useSwapAllowance({
    chainId,
    fromTokenId,
    toTokenId,
    approveAmount,
    address,
  })

  useEffect(() => {
    if (skipApprove) {
      // Enables swap transaction preparation when approval isn't needed
      // See useSwapTransaction hook for more details
      setApproveConfirmed(true)
    }
  }, [skipApprove])

  const { sendSwapTx, isSwapTxLoading, isSwapTxSuccess } = useSwapTransaction(
    chainId,
    fromTokenId,
    toTokenId,
    amountWei,
    thresholdAmountWei,
    direction,
    address,
    isApproveConfirmed
  )

  const onSubmit = async () => {
    if (!rate || !amountWei || !address || !isConnected) return

    if (skipApprove && sendSwapTx) {
      try {
        logger.info('Skipping approve, sending swap tx directly')
        setIsModalOpen(true)
        const swapResult = await sendSwapTx()
        const swapReceipt = await swapResult.wait(1)
        logger.info(`Tx receipt received for swap: ${swapReceipt?.transactionHash}`)
        toastToYourSuccess('Swap Complete!', swapReceipt?.transactionHash, chainId)
        dispatch(setFormValues(null))
      } catch (error) {
        logger.error('Failed to execute swap', error)
      } finally {
        setIsModalOpen(false)
      }
      return
    }

    if (!skipApprove && sendApproveTx) {
      try {
        logger.info('Sending approve tx')
        setIsModalOpen(true)
        const approveResult = await sendApproveTx()
        const approveReceipt = await approveResult.wait(1)
        toastToYourSuccess(
          'Approve complete, starting swap',
          approveReceipt.transactionHash,
          chainId
        )
        setApproveConfirmed(true)
        logger.info(`Tx receipt received for approve: ${approveReceipt.transactionHash}`)
      } catch (error) {
        logger.error('Failed to approve token', error)
        setIsModalOpen(false)
      }
    }
  }

  // TODO find a way to have this trigger from the onSubmit
  useEffect(() => {
    if (isSwapTxLoading || isSwapTxSuccess || !isApproveTxSuccess || !sendSwapTx) return
    logger.info('Sending swap tx')
    sendSwapTx()
      .then((swapResult) => swapResult.wait(1))
      .then((swapReceipt) => {
        logger.info(`Tx receipt received for swap: ${swapReceipt.transactionHash}`)
        toastToYourSuccess('Swap Complete!', swapReceipt.transactionHash, chainId)
        dispatch(setFormValues(null))
      })
      .catch((e) => {
        logger.error('Swap failure:', e)
      })
      .finally(() => setIsModalOpen(false))
  }, [isApproveTxSuccess, isSwapTxLoading, isSwapTxSuccess, sendSwapTx, chainId, dispatch])

  const onClickBack = () => {
    dispatch(setConfirmView(false))
  }

  const onClickRefresh = () => {
    // Note, rates automatically re-fetch regularly
    refetch().catch((e) => logger.error('Failed to refetch quote:', e))
  }

  const { text: buttonText, disabled: isButtonDisabled } = useSwapState({
    isAllowanceLoading,
    skipApprove,
    sendApproveTx,
    isApproveTxLoading,
    isApproveTxSuccess,
    sendSwapTx,
    fromTokenId,
  })

  return (
    <FloatingBox
      width="w-screen md:w-[432px] "
      padding="p-0"
      classes="border border-primary-dark dark:border-[#333336] dark:bg-[#1D1D20]"
    >
      <div className="flex justify-between p-6  border-b border-primary-dark dark:border-[#333336]">
        <button
          onClick={onClickBack}
          className="group h-[36px] w-[36px] flex items-center justify-center dark:bg-[#545457]  dark:text-white rounded-full border border-primary-dark dark:border-transparent"
        >
          <BackArrow className="transform transition-all duration-300 ease-in-out group-hover:-translate-x-[2px]" />
        </button>

        <h2 className="text-[32px] dark:text-white leading-[40px] font-fg font-medium">
          Confirm Swap
        </h2>
        <button
          onClick={onClickRefresh}
          className="h-[36px] w-[36px] flex items-center justify-center transform hover:rotate-90 transition-transform duration-500 ease-in-out dark:bg-[#545457]  dark:text-white rounded-full border border-primary-dark dark:border-transparent"
        >
          <RefreshSpinner />
        </button>
      </div>
      <SwapConfirmSummary
        from={{ amount: fromAmount, weiAmount: fromAmountWei, token: fromTokenId }}
        to={{ amount: toAmount, weiAmount: toAmountWei, token: toTokenId }}
        rate={rate}
      />
      {/* Slippage Info */}
      <div className="flex flex-col mx-6 items-center rounded-xl text-sm mt-6 border border-[#E5E7E9] dark:border-[#303033] dark:bg-[#18181B] ">
        <div className="flex items-center justify-between w-full py-4 mx-6">
          <div className="w-32 text-right text-[#636768] dark:text-[#AAB3B6] mr-6">
            Max Slippage:
          </div>
          <div className="w-32 pr-4 text-right dark:text-white">{`${slippage}%`}</div>
        </div>
        <div className="w-full border-b border-[#E5E7E9]  dark:border-[#303033]" />
        <div className="flex items-center justify-between w-full py-4 mx-6">
          <div className="w-32 text-[#636768] dark:text-[#AAB3B6] text-right mr-6">
            {direction === 'in' ? 'Min Received:' : 'Max Sold'}
          </div>
          <div className="w-32 pr-4 text-right dark:text-white">{thresholdAmount}</div>
        </div>
      </div>

      <div className="flex w-full px-6 pb-6 mt-6">
        <Button3D isFullWidth onClick={onSubmit} isDisabled={isButtonDisabled}>
          {buttonText}
        </Button3D>
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Performing Swap"
        close={() => setIsModalOpen(false)}
        width="max-w-[432px]"
      >
        <MentoLogoLoader skipApprove={skipApprove} />
      </Modal>
    </FloatingBox>
  )
}

interface SwapConfirmSummaryProps {
  from: { amount: string; weiAmount: string; token: TokenId }
  to: { amount: string; weiAmount: string; token: TokenId }
  rate?: string
}

export function SwapConfirmSummary({ from, to, rate }: SwapConfirmSummaryProps) {
  const maxAmountLength = 8
  const fromToken = Tokens[from.token]
  const toToken = Tokens[to.token]

  const handleAmount = (amount: string) => {
    const shouldTruncate = amount.length > maxAmountLength
    const displayedAmount = shouldTruncate ? truncateTextByLength(maxAmountLength, amount) : amount

    return shouldTruncate ? (
      // todo: Replace to module.css. Couldn't been replaced because of incorrect styles while replacing
      <div className="relative text-lg font-semibold leading-6 text-center dark:text-white group">
        <span data-testid="truncatedAmount"> {displayedAmount}</span>
        <Tooltip text={amount}></Tooltip>
      </div>
    ) : (
      <div className="relative text-lg font-semibold leading-6 text-center dark:text-white group">
        <span data-testid="fullAmount"> {displayedAmount}</span>
      </div>
    )
  }

  return (
    <div className="dark:bg-[#18181B] bg-[#EFF1F3] rounded-xl mt-6 mx-6 ">
      <div className="relative flex items-center gap-3 rounded-xl justify-between bg-white border border-[#E5E7E9] dark:border-transparent dark:bg-[#303033]  p-[5px]">
        <div className="flex flex-1 items-center pl-3 h-[70px] bg-[#EFF1F3] dark:bg-[#18181B] rounded-lg">
          <div className="my-[15px]">
            <TokenIcon size="l" token={fromToken} />
          </div>
          <div className="flex flex-col items-center flex-1 px-2">
            <div className="text-sm text-center dark:text-[#AAB3B6]">{fromToken.symbol}</div>
            {handleAmount(toSignificant(from.amount))}
          </div>
        </div>
        <div className="dark:text-[#AAB3B6]">
          <ChevronRight />
        </div>
        <div className="flex flex-1 items-center pr-3 h-[70px] bg-[#EFF1F3] dark:bg-[#18181B] rounded-lg">
          <div className="flex flex-col items-center flex-1 px-2">
            <div className="text-sm text-center dark:text-[#AAB3B6]">{toToken.symbol}</div>
            {handleAmount(toSignificant(to.amount) || '0')}
          </div>
          <div className="my-[15px]">
            <TokenIcon size="l" token={toToken} />
          </div>
        </div>
      </div>

      <div className="py-2 w-full flex items-center justify-center text-sm rounded-b text-[#AAB3B6]">
        {rate ? `${rate} ${from.token} : 1 ${to.token}` : 'Loading...'}
      </div>
    </div>
  )
}

const ChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.33}
      d="m8.5 5.5 4 4.5-4 4.5"
    />
  </svg>
)

const MentoLogoLoader = ({ skipApprove }: { skipApprove: boolean }) => {
  const { connector } = useAccount()

  return (
    <>
      <div className="border-y border-[#E5E7E9] dark:border-[#333336]">
        <div className="w-[124px] h-[124px] mx-auto my-6 dark:hidden">
          <Lottie animationData={mentoLoaderBlue} />
        </div>
        <div className="w-[124px] h-[124px] mx-auto my-6 hidden dark:block ">
          <Lottie animationData={mentoLoaderGreen} />
        </div>
      </div>

      <div className="my-6">
        <div className="text-sm text-center text-[#636768] dark:text-[#AAB3B6]">
          {skipApprove ? 'Sending swap transaction' : 'Sending two transactions: Approve and Swap'}
        </div>
        <div className="mt-3 text-sm text-center text-[#636768] dark:text-[#AAB3B6]">
          {`Sign with ${connector?.name || 'wallet'} to proceed`}
        </div>
      </div>
    </>
  )
}

const BackArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={7} height={12} fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.33}
      d="M5.5 10.5 1.5 6l4-4.5"
    />
  </svg>
)

const RefreshSpinner = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path stroke="currentColor" strokeWidth={1.33} d="M16.113 7.333a6.669 6.669 0 0 0-12.746 2" />
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={1.33}
      d="M13.335 7.333h2.933a.4.4 0 0 0 .4-.4V4M3.922 12.667a6.67 6.67 0 0 0 12.746-2"
    />
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.33}
      d="M6.7 12.667H3.768a.4.4 0 0 0-.4.4V16"
    />
  </svg>
)
