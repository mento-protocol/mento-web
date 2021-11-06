import Image from 'next/image'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { TextLink } from 'src/components/buttons/TextLink'
import { setFormValues, setSubpage } from 'src/features/granda/grandaSlice'
import { GrandaSubpage } from 'src/features/granda/types'
import { SwapFormInner } from 'src/features/swap/SwapForm'
import { SwapFormValues } from 'src/features/swap/types'
import { useFormValidator } from 'src/features/swap/useFormValidator'
import InfoCircle from 'src/images/icons/info-circle.svg'
import { FloatingBox } from 'src/layout/FloatingBox'

export function ProposalForm() {
  const balances = useAppSelector((s) => s.account.balances)
  const { toCeloRates, showSlippage } = useAppSelector((s) => s.swap)
  const sizeLimits = useAppSelector((s) => s.granda.config?.exchangeLimits)

  const dispatch = useAppDispatch()
  const onSubmit = (values: SwapFormValues) => {
    dispatch(setFormValues(values))
  }

  const validateForm = useFormValidator(balances, sizeLimits)
  // const onClickBack = () => {
  //   dispatch(setSubpage(GrandaSubpage.List))
  // }

  const onClickSeeHistory = () => {
    dispatch(setSubpage(GrandaSubpage.List))
  }

  return (
    <FloatingBox width="w-100" classes="overflow-visible">
      <div className="flex items-center justify-center">
        {/* <BackButton width={26} height={26} onClick={onClickBack} /> */}
        <h2 className="text-lg font-medium">Propose Granda Exchange</h2>
        {/* <div style={{ width: '26px' }}></div> */}
      </div>
      <div className="py-2 px-4 my-3 bg-greengray-lightest rounded-md">
        <div className=" flex items-center opacity-80">
          <Image src={InfoCircle} alt="info" width={42} height={42} />
          <div className="text-sm ml-3">
            Granda Mento is a{' '}
            <TextLink
              href="https://docs.celo.org/celo-codebase/protocol/stability/granda-mento"
              className="underline"
            >
              special process
            </TextLink>{' '}
            for very large exchanges (cUSD 500,000+). See{' '}
            <button onClick={onClickSeeHistory} type="button" className="underline">
              exchange history
            </button>
            .
          </div>
        </div>
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
