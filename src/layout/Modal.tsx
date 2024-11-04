import { Dialog, Transition } from '@headlessui/react'
import localFont from 'next/font/local'
import { Fragment, PropsWithChildren } from 'react'
import { IconButton } from 'src/components/buttons/IconButton'
import X from 'src/images/icons/x.svg'

const foundersGrotesk = localFont({
  src: '../../public/fonts/founders-grotesk-medium.woff2',
  variable: '--font-founders-grotesk',
})

export function Modal({
  isOpen,
  title,
  close,
  width,
  children,
}: PropsWithChildren<{ isOpen: boolean; title: string; close: () => void; width?: string }>) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-950 bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`
                  w-full ${
                    width || 'max-w-xs'
                  } max-h-[90vh] transform overflow-auto rounded-2xl bg-white dark:bg-zinc-900 border border-primary-dark dark:border-zinc-800 text-left shadow-lg transition-all
                `}
              >
                <div className="h-20 w-full justify-between items-center inline-flex px-6 py-4 sm:py-6">
                  <div className="text-gray-950 dark:text-white sm:text-[32px] text-[26px] font-medium leading-10">
                    <span className={`${foundersGrotesk.className}`}>{title}</span>
                  </div>
                  <div className="p-1 rounded-[32px] border border-gray-950 dark:border-zinc-600 dark:bg-zinc-600 justify-start items-start flex">
                    <div className="w-6 h-6 relative">
                      <IconButton
                        imgSrc={X}
                        onClick={close}
                        title="Close"
                        classes="hover:rotate-90 w-full h-full dark:invert"
                        width={24}
                        height={24}
                      />
                    </div>
                  </div>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

