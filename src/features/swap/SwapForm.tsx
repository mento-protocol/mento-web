import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Form, Formik, useFormikContext } from 'formik'
import { ReactNode, SVGProps, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Spinner } from 'src/components/animation/Spinner'
import { Button3D } from 'src/components/buttons/3DButton'
import { RadioInput } from 'src/components/input/RadioInput'
import { TokenSelectField } from 'src/components/input/TokenSelectField'
import { TokenId, Tokens, isStableToken, isUSDCVariant } from 'src/config/tokens'
import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { SettingsMenu } from 'src/features/swap/SettingsMenu'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapDirection, SwapFormValues } from 'src/features/swap/types'
import { useFormValidator } from 'src/features/swap/useFormValidator'
import { useSwapQuote } from 'src/features/swap/useSwapQuote'
import { parseInputExchangeAmount } from 'src/features/swap/utils'
import { FloatingBox } from 'src/layout/FloatingBox'
import { fromWeiRounded } from 'src/utils/amount'
import { useTimeout } from 'src/utils/timeout'
import { useAccount } from 'wagmi'

const initialValues: SwapFormValues = {
  fromTokenId: TokenId.CELO,
  toTokenId: TokenId.cUSD,
  amount: '',
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
        <h2 className=" text-[32px] leading-10 font-fg font-medium text-primary-dark dark:text-clean-white ">
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
  const balances = useAppSelector((s) => s.account.balances)
  const { showSlippage } = useAppSelector((s) => s.swap)

  const dispatch = useAppDispatch()
  const onSubmit = (values: SwapFormValues) => {
    dispatch(setFormValues(values))
  }
  const validateForm = useFormValidator(balances)

  return (
    <Formik<SwapFormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange={false}
      validateOnBlur={false}
    >
      <Form>
        <SwapFormInputs balances={balances} />
        {showSlippage && <SlippageRow />}
        <div className="flex justify-center w-full my-6 mb-0">
          <SubmitButton />
        </div>
      </Form>
    </Formik>
  )
}

function SwapFormInputs({ balances }: { balances: AccountBalances }) {
  const { address, isConnected } = useAccount()

  const { values, setFieldValue } = useFormikContext<SwapFormValues>()
  const { amount, direction, fromTokenId, toTokenId } = values

  const amountWei = parseInputExchangeAmount(amount, direction === 'in' ? fromTokenId : toTokenId)
  const { isLoading, quote, rate } = useSwapQuote(amountWei, direction, fromTokenId, toTokenId)

  const roundedBalance = fromWeiRounded(balances[fromTokenId], Tokens[fromTokenId].decimals)
  const onClickUseMax = () => {
    setFieldValue('amount', roundedBalance)
    if (fromTokenId === TokenId.CELO) {
      toast.warn('Consider keeping some CELO for transaction fees')
    }
  }

  const onChangeToken = (isFromToken: boolean) => (tokenId: string) => {
    const targetField = isFromToken ? 'fromTokenId' : 'toTokenId'
    const otherField = isFromToken ? 'toTokenId' : 'fromTokenId'
    if (isUSDCVariant(tokenId)) {
      setFieldValue(targetField, tokenId)
      setFieldValue(otherField, TokenId.cUSD)
    } else if (isStableToken(tokenId)) {
      setFieldValue(targetField, tokenId)
      setFieldValue(otherField, TokenId.CELO)
    } else {
      const stableTokenId = isStableToken(values[targetField]) ? values[targetField] : TokenId.cUSD
      setFieldValue(targetField, tokenId)
      setFieldValue(otherField, stableTokenId)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <TokenSelectFieldWrapper>
        <div className="flex items-center ">
          <TokenSelectField name="fromTokenId" label="From Token" onChange={onChangeToken(true)} />
        </div>
        <div className="flex flex-col items-end">
          {address && isConnected && (
            <button
              type="button"
              title="Use full balance"
              className="text-xs text-gray-500 hover:underline"
              onClick={onClickUseMax}
            >{`Use Max (${roundedBalance})`}</button>
          )}
          <AmountField quote={quote} isQuoteLoading={isLoading} direction="in" />
        </div>
      </TokenSelectFieldWrapper>
      <div className="flex items-center justify-between">
        <div className="transition-all ml-[70px] bg-white rounded-full hover:rotate-180">
          <ReverseTokenButton />
        </div>
        <div className="flex items-center justify-end px-1.5 text-xs dark:text-[#AAB3B6]">
          {rate ? `${rate} ${fromTokenId} ~ 1 ${toTokenId}` : '...'}
        </div>
      </div>
      <TokenSelectFieldWrapper>
        <div className="flex items-center">
          <TokenSelectField name="toTokenId" label="To Token" onChange={onChangeToken(false)} />
        </div>
        <AmountField quote={quote} isQuoteLoading={isLoading} direction="out" />
      </TokenSelectFieldWrapper>
    </div>
  )
}

const TokenSelectFieldWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-clean-white border border-primary-dark dark:border-[#333336] dark:bg-[#1D1D20]">
      {children}
    </div>
  )
}

function AmountField({
  direction,
  quote,
  isQuoteLoading,
}: {
  direction: SwapDirection
  quote: string
  isQuoteLoading: boolean
}) {
  const { values, setValues } = useFormikContext<SwapFormValues>()

  const isCurrentInput = values.direction == direction

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValues({ ...values, amount: value, direction })
  }

  if (!isCurrentInput && isQuoteLoading) {
    return (
      <div className="flex items-center justify-center w-8 h-8 pt-1">
        <div className="scale-[0.3] opacity-80">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <input
      value={isCurrentInput ? values.amount : quote}
      name={`amount-${direction}`}
      type="number"
      step="any"
      placeholder="0.00"
      className="pt-1 text-[20px] font-medium text-right bg-transparent font-fg w-36 focus:outline-none"
      onChange={onChange}
    />
  )
}

function ReverseTokenButton() {
  const { values, setFieldValue } = useFormikContext<SwapFormValues>()
  const { fromTokenId, toTokenId } = values

  const onClickReverse = () => {
    setFieldValue('fromTokenId', toTokenId)
    setFieldValue('toTokenId', fromTokenId)
  }

  return (
    <button
      title="Swap inputs"
      onClick={onClickReverse}
      className="flex items-center justify-center rounded-full border h-[36px] w-[36px] border-primary-dark dark:border-none  dark:bg-[#545457] text-primary-dark dark:text-clean-white"
    >
      <DownArrow />
    </button>
  )
}

// function FieldDividerLine() {
//   return <div className="w-px h-12 ml-3 bg-gray-300"></div>
// }

function SlippageRow() {
  return (
    <div
      className="relative flex items-center justify-between my-6 text-sm space-x-7 dark:text-clean-white px-[5px] font-medium"
      role="group"
    >
      <div>Max Slippage:</div>
      <RadioInput name="slippage" value="0.5" label="0.5%" />
      <RadioInput name="slippage" value="1.0" label="1.0%" />
      <RadioInput name="slippage" value="1.5" label="1.5%" />
    </div>
  )
}

function SubmitButton() {
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const isAccountReady = address && isConnected

  const { errors, setErrors, touched, setTouched } = useFormikContext<SwapFormValues>()
  const error =
    touched.amount && (errors.amount || errors.fromTokenId || errors.toTokenId || errors.slippage)
  const text = error ? error : isAccountReady ? 'Continue' : 'Connect Wallet'
  const type = isAccountReady ? 'submit' : 'button'
  const onClick = isAccountReady ? undefined : openConnectModal

  const clearErrors = useCallback(() => {
    setErrors({})
    setTouched({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setErrors, setTouched, errors, touched])

  useTimeout(clearErrors, 3000)

  return (
    <Button3D fullWidth onClick={onClick} type={type} error={error ? true : false}>
      {text}
    </Button3D>
  )
}

const DownArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={15} fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.33}
      d="M7 .75v12.5m0 0 5.625-5.625M7 13.25 1.375 7.625"
    />
  </svg>
)
