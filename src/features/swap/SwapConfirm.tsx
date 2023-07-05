import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { toastToYourSuccess } from 'src/components/TxSuccessToast'
import { Spinner } from 'src/components/animation/Spinner'
import { BackButton } from 'src/components/buttons/BackButton'
import { RefreshButton } from 'src/components/buttons/RefreshButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { MAX_EXCHANGE_RATE, MAX_EXCHANGE_TOKEN_SIZE, MIN_EXCHANGE_RATE } from 'src/config/consts'
import { TokenId, Tokens } from 'src/config/tokens'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import { useApproveTransaction } from 'src/features/swap/useApproveTransaction'
import { useSwapQuote } from 'src/features/swap/useSwapQuote'
import { useSwapTransaction } from 'src/features/swap/useSwapTransaction'
import { getMaxSellAmount, getMinBuyAmount } from 'src/features/swap/utils'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { FloatingBox } from 'src/layout/FloatingBox'
import { Modal } from 'src/layout/Modal'
import { Color } from 'src/styles/Color'
import { fromWeiRounded, getAdjustedAmount } from 'src/utils/amount'
import { logger } from 'src/utils/logger'
import { useAccount, useChainId } from 'wagmi'

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
    approveAmount,
    address
  )
  const [isApproveConfirmed, setApproveConfirmed] = useState(false)

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
    if (new BigNumber(amountWei).gt(MAX_EXCHANGE_TOKEN_SIZE)) {
      toast.error('Amount exceeds limit')
      return
    }
    const rateBN = new BigNumber(rate)
    if (rateBN.lt(MIN_EXCHANGE_RATE) || rateBN.gt(MAX_EXCHANGE_RATE)) {
      toast.error('Rate seems incorrect')
      return
    }

    if (!sendApproveTx || isApproveTxSuccess || isApproveTxLoading) {
      logger.debug('Approve already started or finished, ignoring submit')
      return
    }

    setIsModalOpen(true)

    try {
      logger.info('Sending approve tx')
      const approveResult = await sendApproveTx()
      const approveReceipt = await approveResult.wait(1)
      toastToYourSuccess('Approve complete, starting swap', approveReceipt.transactionHash, chainId)
      setApproveConfirmed(true)
      logger.info(`Tx receipt received for approve: ${approveReceipt.transactionHash}`)
    } catch (error) {
      logger.error('Failed to approve token', error)
      setIsModalOpen(false)
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
    dispatch(setFormValues(null))
  }

  const onClickRefresh = () => {
    // Note, rates automatically re-fetch regularly
    refetch().catch((e) => logger.error('Failed to refetch quote:', e))
  }

  return (
    <FloatingBox width="w-96">
      <div className="flex justify-between">
        <BackButton width={26} height={26} onClick={onClickBack} />
        <h2 className="text-lg font-medium">Confirm Swap</h2>
        <RefreshButton width={24} height={24} onClick={onClickRefresh} />
      </div>
      <SwapConfirmSummary
        from={{ amount: fromAmount, weiAmount: fromAmountWei, token: fromTokenId }}
        to={{ amount: toAmount, weiAmount: toAmountWei, token: toTokenId }}
        rate={rate}
      />
      <div className="flex flex-col items-center text-sm">
        <div className="flex items-center mt-6">
          <div className="w-32 text-right mr-6">Max Slippage:</div>
          <div className="w-32 font-mono">{`${slippage}%`}</div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-32 text-right mr-6">
            {direction === 'in' ? 'Min Received:' : 'Max Sold'}
          </div>
          <div className="w-32 font-mono">{thresholdAmount}</div>
        </div>
      </div>
      <div className="flex justify-center mt-5 mb-1">
        <SolidButton size="m" onClick={onSubmit}>
          Swap
        </SolidButton>
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Performing Swap"
        close={() => setIsModalOpen(false)}
        width="max-w-xs"
      >
        <BasicSpinner />
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
  const fromToken = Tokens[from.token]
  const toToken = Tokens[to.token]

  return (
    <div className="bg-greengray-lightest rounded-md mt-6">
      <div className="relative flex items-center justify-between">
        <div className="flex flex-1 items-center px-2.5 py-3 border-r border-gray-400">
          <TokenIcon size="l" token={fromToken} />
          <div className="flex flex-col flex-1 items-center px-2">
            <div className="text-sm text-center">{fromToken.symbol}</div>
            <div className="text-lg text-center font-mono leading-6">{from.amount}</div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end px-2.5 py-3">
          <div className="flex flex-col flex-1 items-center px-2">
            <div className="text-sm text-center">{toToken.symbol}</div>
            <div className="text-lg text-center font-mono leading-6">{to.amount || '0'}</div>
          </div>
          <TokenIcon size="l" token={toToken} />
        </div>
        <div
          style={{ top: '42%' }}
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4"
        >
          <RightCircleArrow />
        </div>
      </div>
      <div className="flex items-end justify-center">
        <div className="py-0.5 px-3 border border-b-0 border-black50 text-black50 text-sm rounded-t">
          {rate ? `${rate} ${from.token} : 1 ${to.token}` : 'Loading...'}
        </div>
      </div>
    </div>
  )
}

function RightCircleArrow() {
  return (
    <div className="bg-greengray-lightest">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill={Color.primaryBlack50}
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
        />
      </svg>
    </div>
  )
}

function BasicSpinner() {
  const { connector } = useAccount()
  return (
    <div className="my-6 flex flex-col justify-center items-center">
      <Spinner />
      <div className="mt-5 text-sm text-center text-gray-500">
        Sending two transactions: Approve and Swap
      </div>
      <div className="mt-3 text-sm text-center text-gray-500">{`Sign with ${
        connector?.name || 'wallet'
      } to proceed`}</div>
    </div>
  )
}
