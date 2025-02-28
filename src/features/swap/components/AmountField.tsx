import { useFormikContext } from 'formik'
import { Spinner } from 'src/components/animation/Spinner'
import { toSignificant } from 'src/utils/amount'
import { escapeRegExp, inputRegex } from 'src/utils/string'

import { SwapDirection, SwapFormValues } from '../types'

interface Props {
  direction: SwapDirection
  quote: string
  isQuoteLoading: boolean
}

export function AmountField({ direction, quote, isQuoteLoading }: Props) {
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
