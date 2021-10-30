import { useContractKit } from '@celo-tools/use-contractkit'
import { ContractKit } from '@celo/contractkit'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { BackButton } from 'src/components/buttons/BackButton'
import { RefreshButton } from 'src/components/buttons/RefreshButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { TextLink } from 'src/components/buttons/TextLink'
import { config } from 'src/config/config'
import {
  MAX_EXCHANGE_RATE,
  MAX_EXCHANGE_TOKEN_SIZE,
  MIN_EXCHANGE_RATE,
  SIGN_OPERATION_TIMEOUT,
} from 'src/config/consts'
import { NativeTokenId, NativeTokens } from 'src/config/tokens'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { getExchangeContract, getTokenContract } from 'src/features/swap/contracts'
import { fetchExchangeRates } from 'src/features/swap/fetchExchangeRates'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import { getMinBuyAmount, useExchangeValues } from 'src/features/swap/utils'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { FloatingBox } from 'src/layout/FloatingBox'
import { Color } from 'src/styles/Color'
import { fromWeiRounded } from 'src/utils/amount'
import { logger } from 'src/utils/logger'
import { asyncTimeout, PROMISE_TIMEOUT } from 'src/utils/timeout'

interface Props {
  formValues: SwapFormValues
}

export function SwapConfirm(props: Props) {
  const { fromAmount, fromTokenId, toTokenId, slippage } = props.formValues
  const toCeloRates = useAppSelector((s) => s.swap.toCeloRates)
  const dispatch = useAppDispatch()
  const { address, kit, initialised, performActions } = useContractKit()

  // Ensure invariants are met, otherwise return to swap form
  const isConfirmValid = fromAmount && fromTokenId && toTokenId && address && kit
  useEffect(() => {
    if (!isConfirmValid) {
      dispatch(setFormValues(null))
    }
  }, [isConfirmValid, dispatch])

  const { from, to, rate, stableTokenId } = useExchangeValues(
    fromAmount,
    fromTokenId,
    toTokenId,
    toCeloRates
  )
  const minBuyAmountWei = getMinBuyAmount(from.weiAmount, slippage, rate.value)
  const minBuyAmount = fromWeiRounded(minBuyAmountWei, true)
  const fromToken = NativeTokens[fromTokenId]
  const toToken = NativeTokens[toTokenId]

  const onSubmit = async () => {
    if (!address || !kit) {
      toast.error('Kit not connected')
      return
    }
    if (new BigNumber(from.weiAmount).gt(MAX_EXCHANGE_TOKEN_SIZE)) {
      toast.error('Amount too large')
      return
    }
    if (rate.value < MIN_EXCHANGE_RATE || rate.value > MAX_EXCHANGE_RATE) {
      toast.error('Rate seems incorrect')
      return
    }

    // TODO get adjusted amount?

    const approvalOperation = async (k: ContractKit) => {
      const stableTokenId = fromTokenId === NativeTokenId.CELO ? toTokenId : fromTokenId
      const tokenContract = await getTokenContract(k, fromTokenId)
      const exchangeContract = await getExchangeContract(k, stableTokenId)
      const approveTx = await tokenContract.increaseAllowance(
        exchangeContract.address,
        from.weiAmount
      )
      // Gas price must be set manually because contractkit pre-populate it and
      // its helpers for getting gas price are only meant for stable token prices
      const gasPrice = await k.web3.eth.getGasPrice()
      const approveReceipt = await approveTx.sendAndWaitForReceipt({ gasPrice })
      logger.info(`Tx receipt received for approval: ${approveReceipt.transactionHash}`)
      return approveReceipt.transactionHash
    }
    const approvalOpWithTimeout = asyncTimeout(approvalOperation, SIGN_OPERATION_TIMEOUT)

    const exchangeOperation = async (k: ContractKit) => {
      const sellGold = fromTokenId === NativeTokenId.CELO
      const exchangeContract = await getExchangeContract(k, stableTokenId)
      const exchangeTx = await exchangeContract.sell(from.weiAmount, minBuyAmountWei, sellGold)
      const gasPrice = await k.web3.eth.getGasPrice()
      const exchangeReceipt = await exchangeTx.sendAndWaitForReceipt({ gasPrice })
      logger.info(`Tx receipt received for swap: ${exchangeReceipt.transactionHash}`)
      await dispatch(fetchBalances({ address, kit: k }))
      return exchangeReceipt.transactionHash
    }
    const exchangeOpWithTimeout = asyncTimeout(exchangeOperation, SIGN_OPERATION_TIMEOUT)

    try {
      const txHashes = (await performActions(
        approvalOpWithTimeout,
        exchangeOpWithTimeout
      )) as string[]
      if (!txHashes || txHashes.length !== 2) throw new Error('Tx hashes not found')
      toast.success(<SuccessToast txHash={txHashes[1]} />, { autoClose: 15000 })
      dispatch(setFormValues(null))
    } catch (err: any) {
      if (err.message === PROMISE_TIMEOUT) {
        toast.error('Action timed out')
      } else {
        toast.error('Unable to complete swap')
      }
      logger.error('Failed to execute swap', err)
    }
  }

  const onClickBack = () => {
    dispatch(setFormValues(null))
  }

  const onClickRefresh = () => {
    if (!kit || !initialised) return
    dispatch(fetchExchangeRates({ kit })).catch((err) => {
      toast.error('Error retrieving exchange rates')
      logger.error('Failed to retrieve exchange rates', err)
    })
  }

  return (
    <FloatingBox width="w-96">
      <div className="flex justify-between">
        <BackButton width={26} height={26} onClick={onClickBack} />
        <h2 className="text-lg font-medium">Confirm Swap</h2>
        <RefreshButton width={24} height={24} onClick={onClickRefresh} />
      </div>
      <div className="mt-6 bg-greengray-lightest rounded-md">
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
              <div className="text-lg text-center font-mono leading-6">{to.amount}</div>
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
            {rate.isReady ? `${rate.fromCeloValue} ${stableTokenId} : 1 CELO` : 'Loading...'}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-sm">
        <div className="flex items-center mt-6">
          <div className="w-32 text-right mr-6">Max Slippage:</div>
          <div className="w-32 font-mono">{`${slippage}%`}</div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-32 text-right mr-6">Min Received:</div>
          <div className="w-32 font-mono">{minBuyAmount}</div>
        </div>
      </div>
      <div className="flex justify-center mt-5 mb-1">
        <SolidButton dark={true} size="m" onClick={onSubmit}>
          Swap
        </SolidButton>
      </div>
    </FloatingBox>
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

function SuccessToast({ txHash }: { txHash: string }) {
  return (
    <div>
      Swap Complete!{' '}
      <TextLink className="underline" href={`${config.blockscoutUrl}/tx/${txHash}`}>
        See Details
      </TextLink>
    </div>
  )
}
