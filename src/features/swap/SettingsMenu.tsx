import Image from 'next/image'
import { SwitchButton } from 'src/components/buttons/SwitchButton'
import { config } from 'src/config/config'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { setShowChart, setShowSlippage } from 'src/features/swap/swapSlice'
import GearWhite from 'src/images/icons/gear_new.svg'
import GearBlack from 'src/images/icons/gear_new_white.svg'
import { DropdownModal } from 'src/layout/Dropdown'

export function SettingsMenu() {
  const { showSlippage, showChart } = useAppSelector((s) => s.swap)

  const dispatch = useAppDispatch()

  const onToggleSlippage = (checked: boolean) => {
    dispatch(setShowSlippage(checked))
  }

  const onToggleChart = (checked: boolean) => {
    dispatch(setShowChart(checked))
  }

  return (
    <DropdownModal
      placement="left"
      placementOffset={8}
      buttonContent={(open) => (
        <span
          className={`${
            open
              ? 'bg-primary-dark dark:bg-transparent border dark:border-[#545457]'
              : 'dark:border-none dark:bg-[#545457] '
          }  border border-primary-dark rounded-full h-9 w-9 flex item-center justify-center`}
        >
          <Image
            src={GearWhite}
            className={`${open ? 'block' : 'hidden'} dark:block m-0`}
            alt=""
            width={18}
            height={18}
          />
          <Image
            src={GearBlack}
            className={`${open ? 'hidden' : ''} dark:hidden m-0`}
            alt=""
            width={18}
            height={18}
          />
        </span>
      )}
      buttonTitle="Settings"
      buttonClasses={`p-1 flex items-center justify-center } `}
      // buttonClasses="p-1 flex items-center justify-center hover:opacity-70 active:opacity-60 transition-all"
      modalContent={() => (
        <div className="p-3">
          <div className="text-sm flex items-center gap-3 justify-between ">
            <div className="whitespace-nowrap">Show Slippage</div>
            <SwitchButton checked={showSlippage} onChange={onToggleSlippage} />
          </div>
          {config.showPriceChart && (
            <div className="text-sm flex items-center justify-between mt-4">
              <div>Toggle Chart</div>
              <SwitchButton checked={showChart} onChange={onToggleChart} />
            </div>
          )}
        </div>
      )}
      modalClasses="rounded-xl border border-primary-dark dark:border-none dark:bg-[#404043] dark:text-clean-white"
    />
  )
}
