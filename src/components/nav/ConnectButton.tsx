import { useContractKit } from '@celo-tools/use-contractkit'
import Image from 'next/image'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { Identicon } from 'src/components/Identicon'
import Wallet from 'src/images/icons/wallet.svg'
import XCircle from 'src/images/icons/x-circle.svg'
import { shortenAddress } from 'src/utils/addresses'

export function ConnectButton() {
  const { connect, address, destroy } = useContractKit()

  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(1)

  const onClickDisconnect = async () => {
    setIsOpen(false)
    await destroy()
  }

  return (
    <div className="flex justify-end mb-1 relative opacity-90">
      {address ? (
        <SolidButton
          size="l"
          color="white"
          classes="shadow-md pl-2 pr-2 sm:pr-4 sm:pl-2"
          passThruProps={buttonProps}
        >
          <div className="flex items-center">
            <Identicon address={address} size={30} />
            <div className="hidden sm:block ml-2.5 text-lg">
              {shortenAddress(address, false, true)}
            </div>
          </div>
        </SolidButton>
      ) : (
        <SolidButton
          size="l"
          color="white"
          classes="shadow-md px-3 sm:px-4"
          icon={<WalletIcon />}
          onClick={connect}
        >
          <div className="hidden sm:block">Connect</div>
        </SolidButton>
      )}
      <div
        className={`dropdown-menu w-36 mt-12 mr-px bg-white ${isOpen ? '' : 'hidden'}`}
        role="menu"
      >
        <a
          {...itemProps[0]}
          className="flex items-center cursor-pointer hover:bg-gray-50"
          onClick={onClickDisconnect}
        >
          <LogoutIcon />
          <div>Disconnect</div>
        </a>
      </div>
    </div>
  )
}

function WalletIcon() {
  return (
    <div className="flex items-center sm:mr-2">
      <Image src={Wallet} alt="Wallet" width={18} height={18} />
    </div>
  )
}

function LogoutIcon() {
  return (
    <div className="flex items-center sm:mr-3">
      <Image src={XCircle} alt="Logout" width={18} height={18} />
    </div>
  )
}
