import { Switch } from '@headlessui/react'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SwitchButton({ checked, onChange }: Props) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? 'bg-[#D5F0F6]' : 'bg-primary-dark '
      } px-[1px] border-primary-dark dark:border-transparent py-[3px] items-center relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span
        aria-hidden="true"
        className={`${
          checked
            ? 'bg-primary-dark translate-x-[100%]'
            : '  translate-x-0 dark:bg-clean-white bg-clean-white'
        } 
        pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  )
}
