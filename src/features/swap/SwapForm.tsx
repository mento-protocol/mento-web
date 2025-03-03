import { Form, Formik } from 'formik'
import { TokenId } from 'src/config/tokens'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { FloatingBox } from 'src/layout/FloatingBox'
import { debounce } from 'src/utils/debounce'
import { useAccount } from 'wagmi'

import { SettingsMenu } from './components/SettingsMenu'
import { SlippageRow } from './components/SlippageRow'
import { SubmitButton } from './components/SubmitButton'
import { SwapFormInputs } from './components/SwapFormInputs'
import { useFormValidator } from './hooks/useFormValidator'
import { setConfirmView, setFormValues } from './swapSlice'
import { SwapFormValues } from './types'

const initialValues: SwapFormValues = {
  fromTokenId: TokenId.CELO,
  toTokenId: TokenId.cUSD,
  amount: '',
  quote: '',
  direction: 'in',
  slippage: '1.0',
}

export function SwapFormCard() {
  return (
    <FloatingBox
      width="max-w-md w-full"
      padding="p-0"
      classes="overflow-visible border border-primary-dark dark:border-[#333336] dark:bg-[#1D1D20]"
    >
      <div className="flex justify-between border-b border-primary-dark dark:border-[#333336] p-6">
        <h2 className="text-[32px] leading-10 font-fg font-medium text-primary-dark dark:text-white">
          Swap
        </h2>
        <SettingsMenu />
      </div>
      <div className="p-6">
        <SwapForm />
      </div>
    </FloatingBox>
  )
}

function SwapForm() {
  const { address, isConnected } = useAccount()
  const { balances, lastUpdated } = useAppSelector((s) => s.account)
  const { showSlippage } = useAppSelector((s) => s.swap)

  const isWalletConnected = address && isConnected
  const isBalanceLoaded = balances && Boolean(lastUpdated)

  const dispatch = useAppDispatch()
  const onSubmit = (values: SwapFormValues) => {
    dispatch(setFormValues(values))
    dispatch(setConfirmView(true))
  }
  const validateForm = useFormValidator({
    balances,
    isBalanceLoaded,
    isWalletConnected,
  })
  const debouncedValidateForm = debounce(async (values) => validateForm(values), 100)
  const storedFormValues = useAppSelector((s) => s.swap.formValues)
  const initialFormValues = storedFormValues || initialValues

  return (
    <Formik<SwapFormValues>
      initialValues={initialFormValues}
      onSubmit={onSubmit}
      validate={debouncedValidateForm}
      validateOnChange={true}
      validateOnBlur={false}
    >
      <Form>
        <SwapFormInputs balances={balances} />
        {showSlippage && <SlippageRow />}
        <div className="flex justify-center w-full my-6 mb-0">
          <SubmitButton isWalletConnected={isWalletConnected} isBalanceLoaded={isBalanceLoaded} />
        </div>
      </Form>
    </Formik>
  )
}
