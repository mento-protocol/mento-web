import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Field, Form, Formik, useFormikContext } from 'formik'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { Spinner } from 'src/components/animation/Spinner'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { RadioInput } from 'src/components/input/RadioInput'
import { TokenSelectField } from 'src/components/input/TokenSelectField'
import { TokenId, isStableToken } from 'src/config/tokens'
import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { SettingsMenu } from 'src/features/swap/SettingsMenu'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import { useFormValidator } from 'src/features/swap/useFormValidator'
import { formatExchangeValues } from 'src/features/swap/utils'
import DownArrow from 'src/images/icons/arrow-down-short.svg'
import { FloatingBox } from 'src/layout/FloatingBox'
import { fromWeiRounded } from 'src/utils/amount'
import { useTimeout } from 'src/utils/timeout'
import { useAccount } from 'wagmi'

import { useSwapOutQuote } from './useSwapOutQuote'

const initialValues: SwapFormValues = {
  fromTokenId: TokenId.CELO,
  toTokenId: TokenId.cUSD,
  fromAmount: '',
  slippage: '1.0',
}

export function SwapFormCard() {
  return (
    <FloatingBox width="w-96" classes="overflow-visible">
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-medium pl-1">Swap</h2>
        <SettingsMenu />
      </div>
      <SwapForm />
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
        <div className="flex justify-center mt-5 mb-1">
          <SubmitButton />
        </div>
      </Form>
    </Formik>
  )
}

interface FormInputProps {
  balances: AccountBalances
}

function SwapFormInputs({ balances }: FormInputProps) {
  const { address, isConnected } = useAccount()

  const { values, setFieldValue } = useFormikContext<SwapFormValues>()

  const { from, to } = formatExchangeValues(values.fromAmount, values.fromTokenId, values.toTokenId)
  const { isLoading, toAmount, rate } = useSwapOutQuote(from.weiAmount, from.token, to.token)

  const roundedBalance = fromWeiRounded(balances[values.fromTokenId])
  const onClickUseMax = () => {
    setFieldValue('fromAmount', roundedBalance)
    if (values.fromTokenId === TokenId.CELO) {
      toast.warn('Consider keeping some CELO for transaction fees')
    }
  }

  const onChangeToken = (isFromToken: boolean) => (tokenId: string) => {
    const targetField = isFromToken ? 'fromTokenId' : 'toTokenId'
    const otherField = isFromToken ? 'toTokenId' : 'fromTokenId'
    if (tokenId === TokenId.USDC) {
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
    <div className="relative">
      <div className="flex justify-between items-center py-2 px-3 mt-3 bg-greengray-lightest rounded-md">
        <div className="flex items-center">
          <TokenSelectField name="fromTokenId" label="From Token" onChange={onChangeToken(true)} />
          <FieldDividerLine />
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
          <Field
            id="fromAmount"
            name="fromAmount"
            type="number"
            step="any"
            placeholder="0.00"
            className="w-36 pt-1 bg-transparent text-right text-xl font-mono focus:outline-none"
          />
        </div>
      </div>
      <div className="bg-white rounded-full absolute left-4 top-2/4 -translate-y-1/2 hover:rotate-180 transition-all">
        <ReverseTokenButton />
      </div>
      <div className="flex items-center justify-end my-2.5 px-1.5 text-xs text-gray-400">
        {rate
          ? `${rate} ${from.token} ~ 1 ${to.token}`
          : from.amount !== '0'
          ? 'Loading...'
          : '...'}
      </div>
      <div className="flex justify-between items-center py-2 px-3 mb-1 bg-greengray-lightest rounded-md">
        <div className="flex items-center">
          <TokenSelectField name="toTokenId" label="To Token" onChange={onChangeToken(false)} />
          <FieldDividerLine />
        </div>
        {!isLoading ? (
          <div className="text-xl text-right font-mono w-36 pt-2 overflow-hidden">{toAmount}</div>
        ) : (
          <div className="w-8 h-8 pt-1 flex items-center justify-center">
            <div className="scale-[0.3] opacity-80">
              <Spinner />
            </div>
          </div>
        )}
      </div>
    </div>
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
    <IconButton
      imgSrc={DownArrow}
      width={32}
      height={32}
      classes="p-1.5"
      title="Swap inputs"
      onClick={onClickReverse}
    />
  )
}

function FieldDividerLine() {
  return <div className="w-px h-12 ml-3 bg-gray-300"></div>
}

function SlippageRow() {
  return (
    <div className="flex items-center justify-center mt-5 space-x-7 text-sm" role="group">
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
    touched.fromAmount &&
    (errors.fromAmount || errors.fromTokenId || errors.toTokenId || errors.slippage)
  const classes = error ? 'bg-red-500 hover:bg-red-500 active:bg-red-500' : ''
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
    <SolidButton size="m" type={type} onClick={onClick} classes={classes}>
      {text}
    </SolidButton>
  )
}
