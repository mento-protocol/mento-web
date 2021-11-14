import { useContractKit } from '@celo-tools/use-contractkit'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { BackButton } from 'src/components/buttons/BackButton'
import { RefreshButton } from 'src/components/buttons/RefreshButton'
import { clearProposal } from 'src/features/granda/grandaSlice'
import { FloatingBox } from 'src/layout/FloatingBox'

export function ProposalView() {
  const proposalId = useAppSelector((s) => s.granda.viewProposalId)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // TODO check if proposal id is in data
    if (!proposalId) dispatch(clearProposal())
  }, [proposalId, dispatch])

  const onClickBack = () => {
    dispatch(clearProposal())
  }

  const { kit, initialised } = useContractKit()
  const onClickRefresh = () => {
    if (!kit || !initialised) return
    console.log('TODO')
  }

  return (
    <FloatingBox width="w-100" classes="mb-12 mx-10">
      <div className="flex justify-between">
        <BackButton width={26} height={26} onClick={onClickBack} />
        <h2 className="text-lg font-medium">{`Granda Proposal ${proposalId}`}</h2>
        <RefreshButton width={24} height={24} onClick={onClickRefresh} />
      </div>
      <div>TODO show proposal</div>
    </FloatingBox>
  )
}
