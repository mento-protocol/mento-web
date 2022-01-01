import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SwitchButton } from 'src/components/buttons/SwitchButton'
import { setShowChart, setShowSlippage } from 'src/features/swap/swapSlice'
import Sliders from 'src/images/icons/sliders.svg'

export function SettingsMenu() {
  const { showSlippage, showChart } = useAppSelector((s) => s.swap)

  const dispatch = useAppDispatch()

  const onToggleSlippage = (checked: boolean) => {
    dispatch(setShowSlippage(checked))
  }

  const onToggleChart = (checked: boolean) => {
    dispatch(setShowChart(checked))
  }

  const { buttonProps, itemProps, isOpen } = useDropdownMenu(2)

  return (
    <div className="relative mt-1 mr-1.5">
      <IconButton
        imgSrc={Sliders}
        width={18}
        height={18}
        title="Settings"
        passThruProps={buttonProps}
      />
      <div
        className={`dropdown-menu w-46 mt-3 -right-1 bg-gray-50 ${isOpen ? '' : 'hidden'}`}
        role="menu"
      >
        <a {...itemProps[0]} className="text-sm flex items-center justify-between">
          <div>Toggle Slippage</div>
          <SwitchButton checked={showSlippage} onChange={onToggleSlippage} />
        </a>
        <a {...itemProps[1]} className="text-sm flex items-center justify-between mt-4">
          <div>Toggle Chart</div>
          <SwitchButton checked={showChart} onChange={onToggleChart} />
        </a>
      </div>
    </div>
  )
}
