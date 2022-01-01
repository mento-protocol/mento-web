import { useContractKit } from '@celo-tools/use-contractkit'
import Image from 'next/image'
import { useState } from 'react'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { Identicon } from 'src/components/Identicon'
import { BalancesSummary } from 'src/components/nav/BalancesSummary'
import { NetworkModal } from 'src/components/nav/NetworkModal'
import Clipboard from 'src/images/icons/clipboard-plus.svg'
import Cube from 'src/images/icons/cube.svg'
import Wallet from 'src/images/icons/wallet.svg'
import XCircle from 'src/images/icons/x-circle.svg'
import { shortenAddress } from 'src/utils/addresses'
import { tryClipboardSet } from 'src/utils/clipboard'

export function ConnectButton() {
  const { connect, address, destroy } = useContractKit()

  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(3)

  const onClickCopy = async () => {
    setIsOpen(false)
    if (!address) return
    await tryClipboardSet(address)
  }

  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const onClickChangeNetwork = () => {
    setIsOpen(false)
    setShowNetworkModal(true)
  }

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
        className={`dropdown-menu w-60 mt-12 mr-px bg-white ${isOpen ? '' : 'hidden'}`}
        role="menu"
      >
        <BalancesSummary />
        <a {...itemProps[0]} className={menuOptionClasses} onClick={onClickCopy}>
          <CopyIcon />
          <div>Copy Address</div>
        </a>
        <a {...itemProps[1]} className={menuOptionClasses} onClick={onClickChangeNetwork}>
          <NetworkIcon />
          <div>Change Network</div>
        </a>
        <a {...itemProps[2]} className={menuOptionClasses} onClick={onClickDisconnect}>
          <LogoutIcon />
          <div>Disconnect</div>
        </a>
      </div>
      {showNetworkModal && (
        <NetworkModal isOpen={showNetworkModal} close={() => setShowNetworkModal(false)} />
      )}
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

function NetworkIcon() {
  return (
    <div className="flex items-center sm:mr-3">
      <Image src={Cube} alt="Network" width={18} height={18} />
    </div>
  )
}

function CopyIcon() {
  return (
    <div className="flex items-center sm:mr-3">
      <Image src={Clipboard} alt="Copy" width={18} height={18} />
    </div>
  )
}

const menuOptionClasses = 'flex items-center cursor-pointer p-2 mt-1 rounded hover:bg-gray-100'
