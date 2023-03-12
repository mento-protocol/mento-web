import { useConnectModal } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Identicon } from 'src/components/Identicon'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { BalancesSummary } from 'src/components/nav/BalancesSummary'
import { NetworkModal } from 'src/components/nav/NetworkModal'
import Clipboard from 'src/images/icons/clipboard-plus.svg'
import Cube from 'src/images/icons/cube.svg'
import Logout from 'src/images/icons/logout.svg'
import Wallet from 'src/images/icons/wallet.svg'
import { DropdownModal } from 'src/layout/Dropdown'
import { shortenAddress } from 'src/utils/addresses'
import { tryClipboardSet } from 'src/utils/clipboard'
import { useAccount, useDisconnect } from 'wagmi'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()

  const onClickCopy = async () => {
    if (!address) return
    await tryClipboardSet(address)
    toast.success('Address copied to clipboard', { autoClose: 1200 })
  }

  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const onClickChangeNetwork = () => {
    setShowNetworkModal(true)
  }

  const onClickDisconnect = () => {
    disconnect()
  }

  return (
    <div className="flex justify-end mb-1 relative opacity-90">
      {address && isConnected ? (
        <DropdownModal
          buttonContent={
            <div className="flex items-center">
              <Identicon address={address} size={26} />
              <div className="hidden sm:block ml-2.5">{shortenAddress(address, false, true)}</div>
            </div>
          }
          buttonClasses={styles.walletButton}
          modalContent={() => (
            <div className="p-3">
              <BalancesSummary />
              <div className={styles.menuOption} onClick={onClickCopy}>
                <CopyIcon />
                <div>Copy Address</div>
              </div>
              <div className={styles.menuOption} onClick={onClickChangeNetwork}>
                <NetworkIcon />
                <div>Change Network</div>
              </div>
              <div className={styles.menuOption} onClick={onClickDisconnect}>
                <LogoutIcon />
                <div>Disconnect</div>
              </div>
            </div>
          )}
          modalClasses="w-60 right-px"
        />
      ) : (
        <SolidButton
          size="l"
          color="white"
          classes="shadow-md px-3 sm:px-4"
          icon={<WalletIcon />}
          onClick={openConnectModal}
        >
          <div className="hidden sm:block">Connect</div>
        </SolidButton>
      )}
      {showNetworkModal && (
        <NetworkModal isOpen={showNetworkModal} close={() => setShowNetworkModal(false)} />
      )}
    </div>
  )
}

function WalletIcon() {
  return (
    <div className="flex items-center sm:mr-2">
      <Image src={Wallet} alt="" width={17} height={17} />
    </div>
  )
}

function LogoutIcon() {
  return (
    <div className="flex items-center sm:mr-3">
      <Image src={Logout} alt="" width={19} height={19} />
    </div>
  )
}

function NetworkIcon() {
  return (
    <div className="flex items-center sm:mr-3">
      <Image src={Cube} alt="" width={18} height={18} />
    </div>
  )
}

function CopyIcon() {
  return (
    <div className="flex items-center sm:mr-3">
      <Image src={Clipboard} alt="" width={18} height={18} />
    </div>
  )
}

const styles = {
  // TODO DRY up with SolidButton styles
  walletButton:
    'flex items-center justify-center h-9 py-1 pl-2 pr-2 sm:pr-4 sm:pl-2 bg-white text-black hover:bg-gray-100 active:bg-gray-200 rounded-full shadow-md transition-all duration-300',
  menuOption:
    'flex items-center cursor-pointer p-2 mt-1 rounded hover:bg-gray-100 active:bg-gray-200',
}
