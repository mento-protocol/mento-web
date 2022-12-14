import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SwitchButton } from 'src/components/buttons/SwitchButton'
import { config } from 'src/config/config'
import { setShowChart, setShowSlippage } from 'src/features/swap/swapSlice'
import Gear from 'src/images/icons/gear.svg'

export function SettingsMenu() {
  const { showSlippage, showChart } = useAppSelector((s) => s.swap)

  const dispatch = useAppDispatch()

  const onToggleSlippage = (checked: boolean) => {
    dispatch(setShowSlippage(checked))
  }

  const onToggleChart = (checked: boolean) => {
    dispatch(setShowChart(checked))
  }

  const { buttonProps, itemProps, isOpen } = useDropdownMenu(config.showPriceChart ? 2 : 1)

  return (
    <div className="relative mt-1 mr-1.5">
      <IconButton
        imgSrc={Gear}
        width={18}
        height={18}
        title="Settings"
        passThruProps={buttonProps}
      />
      <div
        className={`dropdown-menu w-46 mt-3 -right-1 bg-white ${isOpen ? '' : 'hidden'}`}
        role="menu"
      >
        <a {...itemProps[0]} className="text-sm flex items-center justify-between">
          <div>Show Slippage</div>
          <SwitchButton checked={showSlippage} onChange={onToggleSlippage} />
        </a>
        {config.showPriceChart && (
          <a {...itemProps[1]} className="text-sm flex items-center justify-between mt-4">
            <div>Toggle Chart</div>
            <SwitchButton checked={showChart} onChange={onToggleChart} />
          </a>
        )}
      </div>
    </div>
  )
}
