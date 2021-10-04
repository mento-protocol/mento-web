import { useContractKit } from '@celo-tools/use-contractkit'
import { ErrorMessage, Field, Form, Formik, FormikErrors, useFormikContext } from 'formik'
import { PropsWithChildren } from 'react'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import TokenSelectField, { TokenOption } from 'src/components/input/TokenSelectField'
import { MIN_ROUNDED_VALUE } from 'src/config/consts'
import { CELO, cEUR, cUSD, isStableToken, NativeTokenId } from 'src/config/tokens'
import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues, ToCeloRates } from 'src/features/swap/types'
import { useExchangeValues } from 'src/features/swap/utils'
import DownArrow from 'src/images/icons/arrow-down-short.svg'
import Sliders from 'src/images/icons/sliders.svg'
import { FloatingBox } from 'src/layout/FloatingBox'
import { areAmountsNearlyEqual, fromWeiRounded, parseAmount, toWei } from 'src/utils/amount'

const initialValues: SwapFormValues = {
  fromTokenId: NativeTokenId.CELO,
  toTokenId: NativeTokenId.cUSD,
  fromAmount: '',
}

const tokens = [
  { value: NativeTokenId.CELO, label: CELO.symbol },
  { value: NativeTokenId.cUSD, label: cUSD.symbol },
  { value: NativeTokenId.cEUR, label: cEUR.symbol },
]

export function SwapForm() {
  const { connect, address } = useContractKit()

  const balances = useAppSelector((s) => s.account.balances)
  const toCeloRates = useAppSelector((s) => s.swap.toCeloRates)

  const dispatch = useAppDispatch()
  const onSubmit = (values: SwapFormValues) => {
    console.log(JSON.stringify(values, null, 2))
    dispatch(setFormValues(values))
  }

  const validateForm = (values?: SwapFormValues): FormikErrors<SwapFormValues> => {
    if (!values || !values.fromAmount) return { fromAmount: 'Amount Required' }
    const parsedAmount = parseAmount(values.fromAmount)
    if (!parsedAmount) return { fromAmount: 'Amount is Invalid' }
    if (parsedAmount.lt(0)) return { fromAmount: 'Amount cannot be negative' }
    if (parsedAmount.lt(MIN_ROUNDED_VALUE)) return { fromAmount: 'Amount too small' }
    const tokenId = values.fromTokenId
    const tokenBalance = balances[tokenId]
    const weiAmount = toWei(parsedAmount)
    if (weiAmount.gt(tokenBalance) && !areAmountsNearlyEqual(weiAmount, tokenBalance)) {
      return { fromAmount: 'Amount exceeds balance' }
    }
    return {}
  }

  return (
    <FloatingBox width="w-96" classes="overflow-visible">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium pl-1">Swap</h2>
        <SettingsMenu />
      </div>
      <Formik<SwapFormValues>
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validateForm}
      >
        <Form>
          <SwapFormInputs balances={balances} toCeloRates={toCeloRates} isConnected={!!address} />
          <div className="flex justify-center mt-5 mb-1">
            {address ? (
              <SolidButton dark={true} size="m" type="submit">
                Continue
              </SolidButton>
            ) : (
              <SolidButton dark={true} size="m" onClick={connect}>
                Connect Wallet
              </SolidButton>
            )}
          </div>
        </Form>
      </Formik>
    </FloatingBox>
  )
}

interface FormInputProps {
  balances: AccountBalances
  toCeloRates: ToCeloRates
  isConnected: boolean
}

function SwapFormInputs(props: FormInputProps) {
  const { balances, toCeloRates, isConnected } = props
  const { values, setFieldValue } = useFormikContext<SwapFormValues>()

  const { to, rate } = useExchangeValues(
    values.fromAmount,
    values.fromTokenId,
    values.toTokenId,
    toCeloRates,
    false
  )
  const toAmount = fromWeiRounded(to.weiAmount, true)
  const rateEstimate = fromWeiRounded(rate.fromCeloWeiValue, true)
  const stableTokenId =
    values.fromTokenId === NativeTokenId.CELO ? values.toTokenId : values.fromTokenId

  const roundedBalance = fromWeiRounded(balances[values.fromTokenId])
  const onClickUseMax = () => {
    setFieldValue('fromAmount', roundedBalance)
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
      <div className="flex justify-between items-center py-2 px-3 mt-5 bg-greengray-lightest rounded-md">
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
        {rate.isReady ? `${rateEstimate} ${stableTokenId} ~ 1 CELO` : 'Loading...'}
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
        <div className="text-xl text-right font-mono w-36 pt-2 overflow-hidden">{toAmount}</div>
      </div>
      <ErrorMessage name="fromAmount" component={ErrorLine} />
      {/* TODO warning message if usemax */}
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

function ErrorLine({ children }: PropsWithChildren<any>) {
  return (
    <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-center text-red-600">
      <div>--</div>
      <div>{children}</div>
      <div>--</div>
    </div>
  )
}

function SettingsMenu() {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3)

  return (
    <div className="relative mt-1 mr-1">
      <IconButton
        imgSrc={Sliders}
        width={20}
        height={20}
        title="Settings"
        passThruProps={buttonProps}
      />
      <div className={`dropdown-menu -right-1 bg-white ${isOpen ? '' : 'hidden'}`} role="menu">
        <a {...itemProps[0]} href="https://example.com">
          Regular link
        </a>
        <a {...itemProps[1]} onClick={() => alert('alert')}>
          With click handler
        </a>
      </div>
    </div>
  )
}
