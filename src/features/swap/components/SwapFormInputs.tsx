import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import { TokenSelectField } from 'src/components/input/TokenSelectField'
import { AccountBalances } from 'src/features/accounts/fetchBalances'

import { useSwapQuote } from '../hooks/useSwapQuote'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { useTokenOptions } from '../hooks/useTokenOptions'
import { SwapFormValues } from '../types'

import { AmountField } from './AmountField'
import { ReverseTokenButton } from './ReverseTokenButton'
import { TokenSelectFieldWrapper } from './TokenSelectFieldWrapper'

interface Props {
  balances: AccountBalances
}

export function SwapFormInputs({ balances }: Props) {
  const { values, setFieldValue } = useFormikContext<SwapFormValues>()
  const { allTokenOptions, swappableTokens } = useTokenOptions(values.fromTokenId)
  const { balance, hasBalance, useMaxBalance } = useTokenBalance(balances, values.fromTokenId)

  const onChangeToken = (isFromToken: boolean) => (tokenId: string) => {
    const targetField = isFromToken ? 'fromTokenId' : 'toTokenId'
    setFieldValue(targetField, tokenId)
  }

  const { amount, direction, fromTokenId, toTokenId } = values
  const { isLoading, quote, rate } = useSwapQuote(amount, direction, fromTokenId, toTokenId)

  useEffect(() => {
    if (values.direction === 'in' && quote && values.quote !== quote) {
      setFieldValue('quote', quote)
    }
  }, [quote, setFieldValue, values.direction, values.quote])

  return (
    <div className="flex flex-col gap-3">
      <TokenSelectFieldWrapper>
        <TokenSelectField
          name="fromTokenId"
          label="From Token"
          tokenOptions={allTokenOptions}
          onChange={onChangeToken(true)}
        />
        <div className="flex flex-col items-end">
          {hasBalance && (
            <button
              type="button"
              title="Use full balance"
              className="text-xs text-gray-500 hover:underline dark:text-[#AAB3B6]"
              onClick={useMaxBalance}
            >{`Use Max (${balance})`}</button>
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
            tokenOptions={swappableTokens}
            onChange={onChangeToken(false)}
          />
        </div>
        <AmountField quote={quote} isQuoteLoading={isLoading} direction="out" />
      </TokenSelectFieldWrapper>
    </div>
  )
}
