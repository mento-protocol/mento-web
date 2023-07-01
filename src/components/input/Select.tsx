import { Listbox, Transition } from '@headlessui/react'
import { Fragment, ReactElement } from 'react'

interface Props {
  value: string
  optionValues: string[]
  onChange: (value: string) => void
  button: (value: string, label?: string) => ReactElement
  option: (value: string, selected?: boolean) => ReactElement
  buttonLabel?: string
}

export function Select({ value, optionValues, onChange, button, option, buttonLabel }: Props) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer focus:outline-none">
          {button(value, buttonLabel)}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {optionValues.map((optionValue) => (
              <Listbox.Option key={optionValue} value={optionValue}>
                {({ selected }) => option(optionValue, selected)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
