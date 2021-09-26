import { useAppSelector } from 'src/app/hooks'
import { SwapConfirm } from 'src/features/swap/SwapConfirm'
import { SwapForm } from 'src/features/swap/SwapForm'

export default function SwapPage() {
  const { formValues } = useAppSelector((state) => state.swap)
  return (
    <div className="flex justify-center items-center h-full">
      <div className="mb-12">
        {!formValues ? <SwapForm /> : <SwapConfirm formValues={formValues} />}
      </div>
    </div>
  )
}
