import { useAppDispatch } from 'src/app/hooks'
import { BackButton } from 'src/components/buttons/BackButton'
import { setFormValues } from 'src/features/granda/grandaSlice'
import { FloatingBox } from 'src/layout/FloatingBox'

export function ProposalConfirm() {
  const dispatch = useAppDispatch()

  const onClickBack = () => {
    dispatch(setFormValues(null))
  }

  return (
    <FloatingBox width="w-96" classes="mb-12 mx-10">
      <div className="flex justify-between">
        <BackButton width={26} height={26} onClick={onClickBack} />
        <h2 className="text-lg font-medium">Confirm Proposal</h2>
        <div style={{ width: '26px' }}></div>
      </div>
      <div>TODO show confirmation</div>
    </FloatingBox>
  )
}
