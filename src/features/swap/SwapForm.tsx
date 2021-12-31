import { Connector, useContractKit } from '@celo-tools/use-contractkit'
import { Field, Form, Formik, FormikErrors, useFormikContext } from 'formik'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { RadioInput } from 'src/components/input/RadioInput'
import TokenSelectField, { TokenOption } from 'src/components/input/TokenSelectField'
import { CELO, cEUR, cREAL, cUSD, isStableToken, NativeTokenId } from 'src/config/tokens'
import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { SettingsMenu } from 'src/features/swap/SettingsMenu'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import { useFormValidator } from 'src/features/swap/useFormValidator'
import { ExchangeValueFormatter, getExchangeValues } from 'src/features/swap/utils'
import DownArrow from 'src/images/icons/arrow-down-short.svg'
import { FloatingBox } from 'src/layout/FloatingBox'
import { fromWeiRounded } from 'src/utils/amount'
import { useTimeout } from 'src/utils/timeout'

const initialValues: SwapFormValues = {
  fromTokenId: NativeTokenId.CELO,
  toTokenId: NativeTokenId.cUSD,
  fromAmount: '',
  slippage: '1.0',
}

const tokens = [
  { value: NativeTokenId.CELO, label: CELO.symbol },
  { value: NativeTokenId.cUSD, label: cUSD.symbol },
  { value: NativeTokenId.cEUR, label: cEUR.symbol },
  { value: NativeTokenId.cREAL, label: cREAL.symbol },
]

export function SwapForm() {
  const balances = useAppSelector((s) => s.account.balances)
  const { toCeloRates, showSlippage } = useAppSelector((s) => s.swap)

  const dispatch = useAppDispatch()
  const onSubmit = (values: SwapFormValues) => {
    dispatch(setFormValues(values))
  }
  const validateForm = useFormValidator(balances)

  const valueFormatter: ExchangeValueFormatter = (fromAmount, fromTokenId, toTokenId) =>
    getExchangeValues(fromAmount, fromTokenId, toTokenId, toCeloRates)

  return (
    <FloatingBox width="w-96" classes="overflow-visible">
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-medium pl-1">Swap</h2>
        <SettingsMenu />
      </div>
      <SwapFormInner
        balances={balances}
        valueFormatter={valueFormatter}
        showSlippage={showSlippage}
        onSubmit={onSubmit}
        validateForm={validateForm}
      />
    </FloatingBox>
  )
}

interface SwapFormInnerProps {
  balances: AccountBalances
  showSlippage: boolean
  onSubmit: (values: SwapFormValues) => void
  validateForm: (values?: SwapFormValues) => FormikErrors<SwapFormValues>
  valueFormatter: ExchangeValueFormatter
}

export function SwapFormInner({
  balances,
  showSlippage,
  onSubmit,
  validateForm,
  valueFormatter,
}: SwapFormInnerProps) {
  const { connect, address } = useContractKit()

  return (
    <Formik<SwapFormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange={false}
      validateOnBlur={false}
    >
      <Form>
        <SwapFormInputs
          balances={balances}
          valueFormatter={valueFormatter}
          isConnected={!!address}
        />
        {showSlippage && <SlippageRow />}
        <div className="flex justify-center mt-5 mb-1">
          <SubmitButton address={address} connect={connect} />
        </div>
      </Form>
    </Formik>
  )
}

interface FormInputProps {
  balances: AccountBalances
  isConnected: boolean
  valueFormatter: ExchangeValueFormatter
}

function SwapFormInputs(props: FormInputProps) {
  const { balances, isConnected, valueFormatter } = props
  const { values, setFieldValue } = useFormikContext<SwapFormValues>()

  const { to, rate, stableTokenId } = valueFormatter(
    values.fromAmount,
    values.fromTokenId,
    values.toTokenId
  )

  const roundedBalance = fromWeiRounded(balances[values.fromTokenId])
  const onClickUseMax = () => {
    setFieldValue('fromAmount', roundedBalance)
    if (values.fromTokenId === NativeTokenId.CELO) {
      toast.warn('Consider keeping some CELO for transaction fees')
    }
  }

  const onChangeToken = (isFromToken: boolean) => (option: TokenOption | null | undefined) => {
    const tokenId = option?.value || NativeTokenId.CELO
    const targetField = isFromToken ? 'fromTokenId' : 'toTokenId'
    const otherField = isFromToken ? 'toTokenId' : 'fromTokenId'
    if (isStableToken(tokenId)) {
      setFieldValue(targetField, tokenId)
      setFieldValue(otherField, NativeTokenId.CELO)
    } else {
      const stableTokenId = isStableToken(values[targetField])
        ? values[targetField]
        : NativeTokenId.cUSD
      setFieldValue(targetField, tokenId)
      setFieldValue(otherField, stableTokenId)
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center py-2 px-3 mt-3 bg-greengray-lightest rounded-md">
        <div className="flex items-center">
          <TokenSelectField
            id="fromTokenSelect"
            name="fromTokenId"
            options={tokens}
            label="From Token"
            onChange={onChangeToken(true)}
          />
          <FieldDividerLine />
        </div>
        <div className="flex flex-col items-end">
          {isConnected && (
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
            placeholder="0.00"
            className="w-36 pt-1 bg-transparent text-right text-xl font-mono focus:outline-none"
          />
        </div>
      </div>
      <div className="bg-white rounded-full absolute left-4 top-2/4 -translate-y-1/2 hover:rotate-180 transition-all">
        <ReverseTokenButton />
      </div>
      <div className="flex items-center justify-end my-2.5 px-1.5 text-xs text-gray-400">
        {rate.isReady ? `${rate.fromCeloValue} ${stableTokenId} ~ 1 CELO` : 'Loading...'}
      </div>
      <div className="flex justify-between items-center py-2 px-3 mb-1 bg-greengray-lightest rounded-md">
        <div className="flex items-center">
          <TokenSelectField
            id="toTokenSelect"
            name="toTokenId"
            options={tokens}
            label="To Token"
            onChange={onChangeToken(false)}
          />
          <FieldDividerLine />
        </div>
        <div className="text-xl text-right font-mono w-36 pt-2 overflow-hidden">{to.amount}</div>
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

interface ButtonProps {
  address: string | null
  connect: () => Promise<Connector>
}

function SubmitButton({ address, connect }: ButtonProps) {
  const { errors, setErrors, touched, setTouched } = useFormikContext<SwapFormValues>()
  const error =
    touched.fromAmount &&
    (errors.fromAmount || errors.fromTokenId || errors.toTokenId || errors.slippage)
  const classes = error ? 'bg-red-500 hover:bg-red-500 active:bg-red-500' : ''
  const text = error ? error : address ? 'Continue' : 'Connect Wallet'
  const type = address ? 'submit' : 'button'
  const onClick = address ? undefined : connect

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
