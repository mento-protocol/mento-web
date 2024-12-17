import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Form, Formik, useFormikContext } from 'formik'
import { ReactNode, SVGProps, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Spinner } from 'src/components/animation/Spinner'
import { Button3D } from 'src/components/buttons/3DButton'
import { RadioInput } from 'src/components/input/RadioInput'
import { TokenSelectField } from 'src/components/input/TokenSelectField'
import { Celo } from 'src/config/chains'
import {
  TokenId,
  Tokens,
  getSwappableTokenOptions,
  getTokenOptionsByChainId,
  isSwappable,
} from 'src/config/tokens'
import { reset as accountReset } from 'src/features/accounts/accountSlice'
import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { reset as blockReset } from 'src/features/blocks/blockSlice'
import { resetTokenPrices } from 'src/features/chart/tokenPriceSlice'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { SettingsMenu } from 'src/features/swap/SettingsMenu'
import { setConfirmView, setFormValues, reset as swapReset } from 'src/features/swap/swapSlice'
import { SwapDirection, SwapFormValues } from 'src/features/swap/types'
import { useFormValidator } from 'src/features/swap/useFormValidator'
import { useSwapQuote } from 'src/features/swap/useSwapQuote'
import { FloatingBox } from 'src/layout/FloatingBox'
import { fromWeiAsString, fromWeiRounded, toSignificant } from 'src/utils/amount'
import { logger } from 'src/utils/logger'
import { escapeRegExp, inputRegex } from 'src/utils/string'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

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
  const balances = useAppSelector((s) => s.account.balances)
  const { showSlippage } = useAppSelector((s) => s.swap)

  const dispatch = useAppDispatch()
  const onSubmit = (values: SwapFormValues) => {
    dispatch(setFormValues(values))
    dispatch(setConfirmView(true)) // Switch to confirm view
  }
  const validateForm = useFormValidator(balances)
  const storedFormValues = useAppSelector((s) => s.swap.formValues) // Get stored form values
  const initialFormValues = storedFormValues || initialValues // Use stored values if they exist

  return (
    <Formik<SwapFormValues>
      initialValues={initialFormValues}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange={true}
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
  const { chain } = useNetwork()

  const tokensForChain = useMemo(() => {
    return chain ? getTokenOptionsByChainId(chain?.id) : getTokenOptionsByChainId(Celo.chainId)
  }, [chain])

  const { values, setFieldValue } = useFormikContext<SwapFormValues>()

  const swappableTokenOptions = useMemo(() => {
    return getSwappableTokenOptions(values.fromTokenId, chain ? chain?.id : Celo.chainId)
  }, [chain, values])

  const { amount, direction, fromTokenId, toTokenId } = values

  const { isLoading, quote, rate } = useSwapQuote(amount, direction, fromTokenId, toTokenId)

  useEffect(() => {
    if (values.direction === 'in' && quote) {
      setFieldValue('quote', quote)
    }
  }, [quote, setFieldValue, values.direction])

  useEffect(() => {
    if (chain && isConnected && !isSwappable(values.fromTokenId, values.toTokenId, chain?.id)) {
      setFieldValue(
        'toTokenId',
        swappableTokenOptions.length < 1 ? TokenId.cUSD : swappableTokenOptions[0]
      )
    }
  }, [setFieldValue, chain, values, swappableTokenOptions, isConnected])

  const roundedBalance = fromWeiRounded(balances[fromTokenId], Tokens[fromTokenId].decimals)
  const isRoundedBalanceGreaterThanZero = Boolean(Number.parseInt(roundedBalance) > 0)
  const onClickUseMax = () => {
    const maxAmount = fromWeiAsString(balances[fromTokenId], Tokens[fromTokenId].decimals)
    setFieldValue('amount', maxAmount)

    setFieldValue('direction', 'in')
    if (fromTokenId === TokenId.CELO) {
      toast.warn('Consider keeping some CELO for transaction fees')
    }
  }

  const onChangeToken = (isFromToken: boolean) => (tokenId: string) => {
    const targetField = isFromToken ? 'fromTokenId' : 'toTokenId'
    setFieldValue(targetField, tokenId)
  }

  return (
    <div className="flex flex-col gap-3">
      <TokenSelectFieldWrapper>
        <div className="flex items-center ">
          <TokenSelectField
            name="fromTokenId"
            label="From Token"
            tokenOptions={tokensForChain}
            onChange={onChangeToken(true)}
          />
        </div>
        <div className="flex flex-col items-end">
          {address && isConnected && isRoundedBalanceGreaterThanZero && (
            <button
              type="button"
              title="Use full balance"
              className="text-xs text-gray-500 hover:underline dark:text-[#AAB3B6]"
              onClick={onClickUseMax}
            >{`Use Max (${roundedBalance})`}</button>
          )}
          <AmountField quote={quote} isQuoteLoading={isLoading} direction="in" />
        </div>
      </TokenSelectFieldWrapper>
      <div className="flex items-center justify-between">
        <div className="transition-all ml-[70px] bg-white dark:bg-[#545457] rounded-full hover:rotate-180">
          <ReverseTokenButton />
        </div>
        <div className="flex items-center justify-end px-1.5 text-xs dark:text-[#AAB3B6]">
          {rate ? `${rate} ${fromTokenId} ~ 1 ${toTokenId}` : '...'}
        </div>
      </div>
      <TokenSelectFieldWrapper>
        <div className="flex items-center">
          <TokenSelectField
            name="toTokenId"
            label="To Token"
            tokenOptions={swappableTokenOptions}
            onChange={onChangeToken(false)}
          />
        </div>
        <AmountField quote={quote} isQuoteLoading={isLoading} direction="out" />
      </TokenSelectFieldWrapper>
    </div>
  )
}

const TokenSelectFieldWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-between pl-[5px] py-[5px] pr-[20px] rounded-xl bg-white border border-primary-dark dark:border-[#333336] dark:bg-[#1D1D20]">
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

    if (typeof value === 'undefined') return
    const val = `${value}`.replace(/,/g, '.')

    if (inputRegex.test(escapeRegExp(val))) {
      setValues({ ...values, amount: val, direction })
    }
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
      autoComplete="off"
      value={isCurrentInput ? values.amount : toSignificant(quote)}
      name={`amount-${direction}`}
      step="any"
      placeholder="0.00"
      className="pt-1 truncate text-[20px] dark:text-white font-medium text-right bg-transparent font-fg w-36 focus:outline-none"
      onChange={onChange}
    />
  )
}

function ReverseTokenButton() {
  const { values, setValues } = useFormikContext<SwapFormValues>()
  const { fromTokenId, toTokenId } = values

  const onClickReverse = async () => {
    setValues({
      ...values,
      toTokenId: fromTokenId,
      fromTokenId: toTokenId,
    })
  }

  return (
    <button
      title="Swap inputs"
      type="button"
      onClick={onClickReverse}
      className="flex items-center justify-center rounded-full border h-[36px] w-[36px] border-primary-dark dark:border-none  dark:bg-[#545457] text-primary-dark dark:text-white"
    >
      <DownArrow />
    </button>
  )
}

function SlippageRow() {
  return (
    <div
      className="relative flex items-center justify-between my-6 text-sm space-x-7 dark:text-white px-[5px] font-medium"
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
  const { chain, chains } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { openConnectModal } = useConnectModal()
  const dispatch = useAppDispatch()
  const { errors, touched } = useFormikContext<SwapFormValues>()

  const isAccountReady = address && isConnected
  const isOnCelo = chains.some((chn) => chn.id === chain?.id)

  const switchToNetwork = async () => {
    try {
      if (!switchNetworkAsync) throw new Error('switchNetworkAsync undefined')
      logger.debug('Resetting and switching to Celo')
      await switchNetworkAsync(42220)
      dispatch(blockReset())
      dispatch(accountReset())
      dispatch(swapReset())
      dispatch(resetTokenPrices())
    } catch (error) {
      logger.error('Error updating network', error)
      toast.error('Could not switch network, does wallet support switching?')
    }
  }

  const error =
    touched.amount && (errors.amount || errors.fromTokenId || errors.toTokenId || errors.slippage)
  let text

  if (error) {
    text = error
  } else if (!isAccountReady) {
    text = 'Connect Wallet'
  } else if (!isOnCelo) {
    text = 'Switch to Celo Network'
  } else {
    text = 'Continue'
  }

  const type = isAccountReady ? 'submit' : 'button'
  let onClick

  if (!isAccountReady) {
    onClick = openConnectModal
  } else if (!isOnCelo) {
    onClick = switchToNetwork
  }

  const showLongError = typeof error === 'string' && error?.length > 50

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {showLongError ? (
        <div className="bg-[#E14F4F] rounded-md text-white p-4 mb-6">{error}</div>
      ) : null}
      <Button3D fullWidth onClick={onClick} type={type} error={error ? true : false}>
        {showLongError ? 'Error' : text}
      </Button3D>
    </div>
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
