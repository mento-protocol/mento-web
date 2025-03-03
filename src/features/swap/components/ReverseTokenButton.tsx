import { useFormikContext } from 'formik'
import { SVGProps } from 'react'

import { SwapFormValues } from '../types'

export function ReverseTokenButton() {
  const { values, setValues } = useFormikContext<SwapFormValues>()

  const onReverseTokens = () => {
    const { fromTokenId, toTokenId, ...rest } = values
    setValues({
      ...rest,
      fromTokenId: toTokenId,
      toTokenId: fromTokenId,
    })
  }

  return (
    <button
      title="Swap inputs"
      type="button"
      onClick={onReverseTokens}
      className="flex items-center justify-center rounded-full border h-[36px] w-[36px] border-primary-dark dark:border-none dark:bg-[#545457] text-primary-dark dark:text-white"
    >
      <DownArrow />
    </button>
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
