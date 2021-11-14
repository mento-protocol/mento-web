import { useContractKit } from '@celo-tools/use-contractkit'
import type { ContractKit } from '@celo/contractkit'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { BackButton } from 'src/components/buttons/BackButton'
import { IconButton } from 'src/components/buttons/IconButton'
import { RefreshButton } from 'src/components/buttons/RefreshButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { TextLink } from 'src/components/buttons/TextLink'
import { toastToYourSuccess } from 'src/components/TxSuccessToast'
import { SIGN_OPERATION_TIMEOUT, WEI_PER_UNIT } from 'src/config/consts'
import { NativeTokenId } from 'src/config/tokens'
import { fetchProposals } from 'src/features/granda/fetchProposals'
import { clearProposal } from 'src/features/granda/grandaSlice'
import { GrandaProposal, GrandaProposalState } from 'src/features/granda/types'
import { SwapConfirmSummary } from 'src/features/swap/SwapConfirm'
import XCircle from 'src/images/icons/x-circle.svg'
import { FloatingBox } from 'src/layout/FloatingBox'
import { defaultModalStyles } from 'src/styles/modals'
import { areAddressesEqual, shortenAddress } from 'src/utils/addresses'
import { fromWei } from 'src/utils/amount'
import { logger } from 'src/utils/logger'
import { asyncTimeout, PROMISE_TIMEOUT } from 'src/utils/timeout'

export function ProposalView() {
  const dispatch = useAppDispatch()
  const { viewProposalId: proposalId, proposals } = useAppSelector((s) => s.granda)
  const proposal = proposalId ? proposals[proposalId] : null

  useEffect(() => {
    if (!proposal) dispatch(clearProposal())
  }, [proposal, dispatch])

  const onClickBack = () => {
    dispatch(clearProposal())
  }

  const { address, kit, initialised, network, performActions } = useContractKit()

  const onClickRefresh = () => {
    if (!kit || !initialised) return
    dispatch(fetchProposals({ kit, force: true }))
      .unwrap()
      .catch((err) => {
        toast.warn('Error retrieving Granda proposals')
        logger.error('Failed to retrieve granda proposals', err)
      })
  }

  const [showConfModal, setShowConfModal] = useState(false)

  if (!proposal) return null

  const isCancellable =
    kit &&
    initialised &&
    address &&
    areAddressesEqual(address, proposal.exchanger) &&
    proposal.state === GrandaProposalState.Proposed

  const onClickCancel = () => {
    setShowConfModal(true)
  }

  const onSubmitCancel = async () => {
    setShowConfModal(false)
    if (!address || !kit) {
      toast.error('Kit not connected')
      return
    }
    const cancelOperation = async (k: ContractKit) => {
      const grandaContract = await k.contracts.getGrandaMento()
      const cancelTx = await grandaContract.cancelExchangeProposal(proposal.id)
      // Gas price must be set manually because contractkit pre-populate it and
      // its helpers for getting gas price are only meant for stable token prices
      const gasPrice = await k.web3.eth.getGasPrice()
      const cancelReceipt = await cancelTx.sendAndWaitForReceipt({ gasPrice })
      logger.info(`Tx receipt received for approval: ${cancelReceipt.transactionHash}`)
      return cancelReceipt.transactionHash
    }
    const cancelOpWithTimeout = asyncTimeout(cancelOperation, SIGN_OPERATION_TIMEOUT)
    try {
      const txHashes = (await performActions(cancelOpWithTimeout)) as string[]
      if (!txHashes || txHashes.length !== 1) throw new Error('Tx hashes not found')
      toastToYourSuccess('Proposal cancelled', txHashes[1], network.explorer)
      dispatch(fetchProposals({ kit, force: true }))
        .unwrap()
        .catch((err) => {
          logger.error('Failed to retrieve proposals after cancel', err)
        })
    } catch (err: any) {
      if (err.message === PROMISE_TIMEOUT) {
        toast.error('Action timed out')
      } else {
        toast.error('Unable to cancel proposal')
      }
      logger.error('Failed to cancel proposal', err)
    }
  }

  return (
    <FloatingBox width="w-100" classes="mb-12 mx-10">
      <div className="flex justify-between">
        <BackButton width={26} height={26} onClick={onClickBack} />
        <h2 className="text-lg font-medium">{`Granda Proposal ${proposalId}`}</h2>
        <RefreshButton width={24} height={24} onClick={onClickRefresh} />
      </div>
      <SwapDetails proposal={proposal} blockscoutUrl={network.explorer} />
      <div className="flex justify-center mt-5 mb-1">
        <SolidButton color="red" size="m" onClick={onClickCancel} disabled={!isCancellable}>
          Cancel
        </SolidButton>
      </div>
      <CancelConfirmationModal
        isOpen={showConfModal}
        close={() => setShowConfModal(false)}
        submit={onSubmitCancel}
      />
    </FloatingBox>
  )
}

function SwapDetails({
  proposal: p,
  blockscoutUrl,
}: {
  proposal: GrandaProposal
  blockscoutUrl: string
}) {
  const fromToken = p.sellCelo ? NativeTokenId.CELO : p.stableTokenId
  const toToken = p.sellCelo ? p.stableTokenId : NativeTokenId.CELO
  const fromAmount = new BigNumber(fromWei(p.sellAmount)).integerValue().toFixed(0)
  const toAmount = new BigNumber(fromWei(p.buyAmount)).integerValue().toFixed(0)
  const effectiveRate = new BigNumber(p.buyAmount).div(p.sellAmount).toNumber()
  const fromCeloRate = p.sellCelo ? effectiveRate : 1 / effectiveRate

  const from = {
    amount: fromAmount,
    weiAmount: p.sellAmount,
    token: fromToken,
  }
  const to = {
    amount: toAmount,
    weiAmount: p.buyAmount,
    token: toToken,
  }
  const rate = {
    value: effectiveRate,
    weiValue: '', // Not needed here
    fromCeloValue: fromCeloRate.toFixed(2),
    fromCeloWeiValue: '', // Not needed here
    weiBasis: WEI_PER_UNIT,
    lastUpdated: Date.now(),
    isReady: true,
  }

  return (
    <div className="-mt-2">
      <SwapConfirmSummary from={from} to={to} rate={rate} stableTokenId={p.stableTokenId} />
      <div className="flex flex-col items-center text-sm">
        <div className="flex items-center mt-6">
          <div className="w-44 text-right mr-6">Proposer:</div>
          <div className="w-44">
            <TextLink
              href={`${blockscoutUrl}/address/${p.exchanger}`}
              className="text-green hover:underline"
            >
              {shortenAddress(p.exchanger, true)}
            </TextLink>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-44 text-right mr-6">Approval time:</div>
          <div className="w-44">{new Date(p.approvalTimestamp * 1000).toLocaleString()}</div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-44 text-right mr-6 font-medium">Proposal Status:</div>
          <div className="w-44 font-medium">{p.state.toUpperCase()}</div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  isOpen: boolean
  close: () => void
  submit: () => void
}

function CancelConfirmationModal({ isOpen, close, submit }: Props) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      style={defaultModalStyles}
      overlayClassName="fixed bg-gray-100 bg-opacity-75 inset-0"
      contentLabel="Network details"
    >
      <div className="bg-white p-5">
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-1 -right-1">
            <IconButton imgSrc={XCircle} title="Close" width={16} height={16} onClick={close} />
          </div>
          <h2 className="text-center text-lg font-medium">Confirm Cancellation</h2>
          <h3 className="text-center font-medium mt-5">
            Are you sure you want to cancel this proposal?
          </h3>
          <p className="text-center mt-2">This will refund your exchange amount.</p>
          <div className="flex justify-center w-full mt-6">
            <SolidButton color="red" size="m" onClick={submit}>
              Cancel
            </SolidButton>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}
