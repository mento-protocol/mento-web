import { Float } from '@headlessui-float/react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { Fragment, ReactElement, ReactNode } from 'react'

interface MenuProps {
  buttonContent: ReactNode
  buttonClasses?: string
  buttonTitle?: string
  menuItems: ReactNode[]
  menuClasses?: string
}

// Uses Headless menu, which auto-closes on any item click
export function DropdownMenu({
  buttonContent,
  buttonClasses,
  buttonTitle,
  menuItems,
  menuClasses,
}: MenuProps) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button title={buttonTitle} className={`flex outline-none ${buttonClasses}`}>
        {buttonContent}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`z-50 absolute -right-1.5 mt-3 origin-top-right rounded-md bg-white shadow-md drop-shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none ${menuClasses}`}
        >
          {menuItems.map((mi, i) => (
            <Menu.Item key={`menu-item-${i}`}>{mi}</Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export type Alignment = 'start' | 'end'
export type Side = 'top' | 'right' | 'bottom' | 'left'
export type AlignedPlacement = `${Side}-${Alignment}`
export type Placement = Side | AlignedPlacement

interface ModalProps {
  buttonContent: (open: boolean) => React.ReactElement
  buttonClasses?: string
  buttonTitle?: string
  modalContent: (close: () => void) => ReactElement
  modalClasses?: string
  placement?: Placement
  placementOffset?: number
}

// Uses Headless Popover, which is a more general purpose dropdown box
export function DropdownModal({
  buttonContent,
  buttonClasses,
  buttonTitle,
  modalContent,
  modalClasses,
  placement = 'bottom-start',
  placementOffset = 0,
}: ModalProps) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <Float offset={placementOffset} placement={placement}>
          <Popover.Button title={buttonTitle} className={`flex outline-none ${buttonClasses}`}>
            {buttonContent(open)}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel
              className={`mt-2 rounded-md bg-white shadow-sm drop-shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none ${modalClasses}`}
            >
              {({ close }) => modalContent(close)}
            </Popover.Panel>
          </Transition>
        </Float>
      )}
    </Popover>
  )
}
