import Image from 'next/image'
import { SwitchButton } from 'src/components/buttons/SwitchButton'
import { config } from 'src/config/config'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { setShowChart, setShowSlippage } from 'src/features/swap/swapSlice'
import Gear from 'src/images/icons/gear.svg'
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
      buttonContent={<Image src={Gear} alt="" width={18} height={18} />}
      buttonTitle="Settings"
      buttonClasses="p-1 flex items-center justify-center hover:opacity-70 active:opacity-60 transition-all"
      modalContent={() => (
        <div className="p-3">
          <div className="text-sm flex items-center justify-between">
            <div>Show Slippage</div>
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
      modalClasses="w-44 right-0"
    />
  )
}
