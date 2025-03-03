import { ReactNode } from 'react'

export function TokenSelectFieldWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between pl-[5px] py-[5px] pr-[20px] rounded-xl bg-white border border-primary-dark dark:border-[#333336] dark:bg-[#1D1D20]">
      {children}
    </div>
  )
}
