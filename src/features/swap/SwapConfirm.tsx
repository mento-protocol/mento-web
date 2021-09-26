import { useAppDispatch } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import LeftArrow from 'src/images/icons/arrow-left-circle.svg'
import { FloatingBox } from 'src/layout/FloatingBox'

interface Props {
  formValues: SwapFormValues
}

export function SwapConfirm(props: Props) {
  const dispatch = useAppDispatch()

  const onSubmit = () => {
    alert(props.formValues)
  }

  const onClickBack = () => {
    dispatch(setFormValues(null))
  }

  return (
    <FloatingBox width="w-100">
      <div className="flex justify-between">
        <IconButton
          imgSrc={LeftArrow}
          width={26}
          height={26}
          title="Go back"
          onClick={onClickBack}
        />
        <h2 className="text-lg font-medium">Confirm Swap</h2>
        <div style={{ width: 26, height: 26 }}></div>
      </div>
      <div>TODO</div>
      <div className="flex justify-center mt-8">
        <SolidButton dark={true} size="m" onClick={onSubmit}>
          Confirm
        </SolidButton>
      </div>
    </FloatingBox>
  )
}
