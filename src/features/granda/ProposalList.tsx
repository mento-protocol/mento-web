import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { Spinner } from 'src/components/animation/Spinner'
import { BackButton } from 'src/components/buttons/BackButton'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { CELO, NativeTokens } from 'src/config/tokens'
import { setSubpage, viewProposal } from 'src/features/granda/grandaSlice'
import { GrandaProposal, GrandaProposalState, GrandaSubpage } from 'src/features/granda/types'
import ArrowRight from 'src/images/icons/arrow-right-short.svg'
import PlusCircle from 'src/images/icons/plus-circle-fill.svg'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { FloatingBox } from 'src/layout/FloatingBox'
import { fromWei } from 'src/utils/amount'

export function ProposalList() {
  const { proposals, proposalsLastUpdated } = useAppSelector((s) => s.granda)
  const numProposals = Object.keys(proposals).length

  const dispatch = useAppDispatch()
  const onClickCreate = () => {
    dispatch(setSubpage(GrandaSubpage.Form))
  }

  return (
    <FloatingBox width="w-100" classes="mb-12 mx-10 p-4">
      <div className="flex justify-between pb-4">
        <BackButton width={26} height={26} onClick={onClickCreate} />
        <h2 className="text-lg font-medium pl-1">Granda Mento Proposals</h2>
        <NewButton onClickCreate={onClickCreate} />
      </div>
      {!numProposals && !proposalsLastUpdated && (
        <div className="w-full flex items-center justify-center my-10">
          <Spinner />
        </div>
      )}
      {!numProposals && !!proposalsLastUpdated && <EmptyList onClickCreate={onClickCreate} />}
      {!!numProposals && !!proposalsLastUpdated && (
        <ProposalRows proposals={Object.values(proposals)} />
      )}
    </FloatingBox>
  )
}

function EmptyList({ onClickCreate }: { onClickCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center my-10 px-6">
      <h3 className="text-center text-gray-600 leading-loose">
        There are no Granda Mento proposals on this network yet.
      </h3>
      <SolidButton onClick={onClickCreate} size="m" classes="mt-6">
        Create New Proposal
      </SolidButton>
    </div>
  )
}

function ProposalRows({ proposals }: { proposals: GrandaProposal[] }) {
  const sorted = proposals.sort((a, b) => new BigNumber(b.id).minus(a.id).toNumber())

  const dispatch = useAppDispatch()
  const onRowClick = (id: string) => {
    dispatch(viewProposal(id))
  }
  return (
    <div className="flex flex-col items-center">
      {sorted.map((p) => {
        const stableToken = NativeTokens[p.stableTokenId]
        const fromToken = p.sellCelo ? CELO : stableToken
        const toToken = p.sellCelo ? stableToken : CELO
        const stateColor = proposalStateToColor(p.state)
        return (
          <button
            className="flex items-center justify-between w-full p-2.5 mt-3 rounded transition bg-greengray-lightest hover:bg-greengray-light"
            onClick={() => onRowClick(p.id)}
            key={p.id}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <div className="">{`Proposal #${p.id}`}</div>
                {!!p.approvalTimestamp && (
                  <div className="text-gray-500 ml-2">{`(${new Date(
                    p.approvalTimestamp * 1000
                  ).toLocaleDateString()})`}</div>
                )}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center mr-1.5">
                  <TokenIcon token={fromToken} size="xs" />
                </div>
                <div className="mr-1.5">{fromWei(p.sellAmount).toFixed(0)}</div>
                <div className="flex items-center mr-1.5">
                  <Image src={ArrowRight} alt={'arrow right'} width={24} height={24} />
                </div>
                <div className="flex items-center mr-1.5">
                  <TokenIcon token={toToken} size="xs" />
                </div>
                <div className="">{fromWei(p.buyAmount).toFixed(0)}</div>
              </div>
            </div>
            <div className={`mr-0.5 p-1.5 border border-dashed rounded ${stateColor}`}>
              {p.state.toUpperCase()}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function NewButton({ onClickCreate }: { onClickCreate: () => void }) {
  return (
    <div className="-mr-1 -mt-1">
      <IconButton
        imgSrc={PlusCircle}
        width={30}
        height={30}
        title="Create Proposal"
        onClick={onClickCreate}
      />
    </div>
  )
}

function proposalStateToColor(state: GrandaProposalState) {
  switch (state) {
    case GrandaProposalState.Proposed:
      return 'border-yellow-500 text-yellow-500'
    case GrandaProposalState.Approved:
    case GrandaProposalState.Executed:
      return 'border-green-800 text-green-800'
    case GrandaProposalState.Cancelled:
      return 'border-red-600 text-red-600'
    default:
      return 'border-gray-500 text-grey-500'
  }
}
