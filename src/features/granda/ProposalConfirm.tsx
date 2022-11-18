import { StableToken } from '@celo/contractkit'
import { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { useCelo } from '@celo/react-celo'
import Image from 'next/image'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { BackButton } from 'src/components/buttons/BackButton'
import { RefreshButton } from 'src/components/buttons/RefreshButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { toastToYourSuccess } from 'src/components/TxSuccessToast'
import { MAX_EXCHANGE_RATE, MIN_EXCHANGE_RATE, SIGN_OPERATION_TIMEOUT } from 'src/config/consts'
import { getTokenContract, nativeTokenToKitToken } from 'src/config/tokenMapping'
import { NativeTokenId } from 'src/config/tokens'
import { getGrandaMento } from 'src/contract-wrappers/granda-mento'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { fetchOracleRates } from 'src/features/granda/fetchOracleRates'
import { fetchProposals } from 'src/features/granda/fetchProposals'
import { setFormValues } from 'src/features/granda/grandaSlice'
import { getExchangeValues } from 'src/features/granda/utils'
import { SwapConfirmSummary } from 'src/features/swap/SwapConfirm'
import InfoCircle from 'src/images/icons/info-circle.svg'
import { FloatingBox } from 'src/layout/FloatingBox'
import { getAdjustedAmount } from 'src/utils/amount'
import { logger } from 'src/utils/logger'
import { asyncTimeout, PROMISE_TIMEOUT } from 'src/utils/timeout'

export function ProposalConfirm() {
  const dispatch = useAppDispatch()
  const balances = useAppSelector((s) => s.account.balances)
  const { config, oracleRates, formValues } = useAppSelector((s) => s.granda)
  const { fromAmount, fromTokenId, toTokenId } = formValues || {}
  const { address, kit, initialised, network, performActions } = useCelo()

  // Ensure invariants are met, otherwise return to form
  const isConfirmValid =
    fromAmount && fromTokenId && toTokenId && address && kit && config && oracleRates
  useEffect(() => {
    if (!isConfirmValid) {
      dispatch(setFormValues(null))
    }
  }, [isConfirmValid, dispatch])
  if (!isConfirmValid) return null

  const { from, to, rate, stableTokenId } = getExchangeValues(
    fromAmount,
    fromTokenId,
    toTokenId,
    config.spread,
    oracleRates
  )
  const tokenBalance = balances[fromTokenId]
  // Check if amount is almost equal to balance max, in which case use max
  // Helps handle problems from imprecision in non-wei amount display
  const finalFromAmount = getAdjustedAmount(from.weiAmount, tokenBalance)

  const onSubmit = async () => {
    if (!address || !kit) {
      toast.error('Kit not connected')
      return
    }
    if (rate.value < MIN_EXCHANGE_RATE || rate.value > MAX_EXCHANGE_RATE) {
      toast.error('Rate seems incorrect')
      return
    }

    const approvalOperation = async (k: MiniContractKit) => {
      const tokenContract = await getTokenContract(k, fromTokenId)
      const grandaContract = await getGrandaMento(kit)
      const approveTx = await tokenContract.increaseAllowance(
        grandaContract.address,
        finalFromAmount
      )
      // Gas price must be set manually because contractkit pre-populate it and
      // its helpers for getting gas price are only meant for stable token prices
      const gasPrice = await k.connection.web3.eth.getGasPrice()
      const approveReceipt = await approveTx.sendAndWaitForReceipt({ gasPrice })
      logger.info(`Tx receipt received for approval: ${approveReceipt.transactionHash}`)
      return approveReceipt.transactionHash
    }
    const approvalOpWithTimeout = asyncTimeout(approvalOperation, SIGN_OPERATION_TIMEOUT)

    const proposeOperation = async (k: MiniContractKit) => {
      const sellCelo = fromTokenId === NativeTokenId.CELO
      const grandaContract = await getGrandaMento(kit)
      const contractId = k.celoTokens.getContract(
        nativeTokenToKitToken(stableTokenId) as StableToken
      )
      const proposeTx = await grandaContract.createExchangeProposal(
        contractId,
        finalFromAmount,
        sellCelo
      )
      const gasPrice = await k.connection.web3.eth.getGasPrice()
      const proposeReceipt = await proposeTx.sendAndWaitForReceipt({ gasPrice })
      logger.info(`Tx receipt received for swap: ${proposeReceipt.transactionHash}`)
      await dispatch(fetchBalances({ address, kit: k }))
      return proposeReceipt.transactionHash
    }
    const proposeOpWithTimeout = asyncTimeout(proposeOperation, SIGN_OPERATION_TIMEOUT)

    try {
      const txHashes = (await performActions(
        approvalOpWithTimeout,
        proposeOpWithTimeout
      )) as string[]
      if (!txHashes || txHashes.length !== 2) throw new Error('Tx hashes not found')
      toastToYourSuccess('Proposal Created!', txHashes[1], network.explorer)
      await dispatch(fetchProposals({ kit, force: true }))
      dispatch(setFormValues(null))
    } catch (err: any) {
      if (err.message === PROMISE_TIMEOUT) {
        toast.error('Action timed out')
      } else {
        toast.error('Unable to complete proposal')
      }
      logger.error('Failed to execute proposal', err)
    }
  }

  const onClickBack = () => {
    dispatch(setFormValues(null))
  }

  const onClickRefresh = () => {
    if (!kit || !initialised) return
    dispatch(fetchOracleRates({ kit }))
      .unwrap()
      .catch((err) => {
        toast.error('Error retrieving exchange rates')
        logger.error('Failed to retrieve exchange rates', err)
      })
  }

  return (
    <FloatingBox width="w-96" classes="mb-12 mx-10">
      <div className="flex justify-between">
        <BackButton width={26} height={26} onClick={onClickBack} />
        <h2 className="text-lg font-medium">Confirm Proposal</h2>
        <RefreshButton width={24} height={24} onClick={onClickRefresh} />
      </div>
      <InfoTip />
      <SwapConfirmSummary from={from} to={to} rate={rate} stableTokenId={stableTokenId} mt="mt-2" />
      <div className="flex flex-col items-center text-sm">
        <div className="flex items-center mt-4">
          <div className="w-32 text-right mr-6">Spread:</div>
          <div className="w-32">{`${config.spread}%`}</div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-32 text-right mr-6">Veto Period:</div>
          <div className="w-32">{(config.vetoPeriodSeconds / 86400).toFixed(2) + ' days'}</div>
        </div>
      </div>
      <div className="flex justify-center mt-5 mb-1">
        <SolidButton size="m" onClick={onSubmit}>
          Propose
        </SolidButton>
      </div>
    </FloatingBox>
  )
}

function InfoTip() {
  return (
    <div className="py-2 px-4 mt-3 bg-greengray-lightest rounded-md">
      <div className=" flex items-center opacity-70">
        <Image src={InfoCircle} alt="info" width={42} height={42} />
        <div className="text-sm font-light ml-3">
          Funds will be transferred out of your account until the exchange is executed or cancelled.
        </div>
      </div>
    </div>
  )
}
