import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { setFormValues } from 'src/features/granda/grandaSlice'
import { SwapFormInner } from 'src/features/swap/SwapForm'
import { SwapFormValues } from 'src/features/swap/types'
import { useFormValidator } from 'src/features/swap/useFormValidator'
import { FloatingBox } from 'src/layout/FloatingBox'

export function ProposalForm() {
  const balances = useAppSelector((s) => s.account.balances)
  const { toCeloRates, showSlippage } = useAppSelector((s) => s.swap)
  const sizeLimits = useAppSelector((s) => s.granda.sizeLimits)

  const dispatch = useAppDispatch()
  const onSubmit = (values: SwapFormValues) => {
    dispatch(setFormValues(values))
  }

  const validateForm = useFormValidator(balances, sizeLimits)
  // const onClickBack = () => {
  //   dispatch(setSubpage(GrandaSubpage.List))
  // }

  return (
    <FloatingBox width="w-96" classes="overflow-visible">
      <div className="flex items-center justify-center">
        {/* <BackButton width={26} height={26} onClick={onClickBack} /> */}
        <h2 className="text-lg font-medium">Propose Granda Exchange</h2>
        {/* <div style={{ width: '26px' }}></div> */}
      </div>
      <div className="flex items-center py-2 px-3 my-3 bg-greengray-lightest rounded-md">
        <div>TODO icon</div>
        <div>TODO info</div>
      </div>
      <SwapFormInner
        balances={balances}
        toCeloRates={toCeloRates}
        showSlippage={showSlippage}
        onSubmit={onSubmit}
        validateForm={validateForm}
      />
    </FloatingBox>
  )
}
