import { RadioInput } from 'src/components/input/RadioInput'

export function SlippageRow() {
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
