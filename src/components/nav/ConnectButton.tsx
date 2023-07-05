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
    <div className="relative flex justify-end mb-1 opacity-90">
      {address && isConnected ? (
        <DropdownModal
          buttonContent={
            <div className="flex items-center">
              <Identicon address={address} size={26} />
              <div className="hidden sm:block ml-[12px]">{shortenAddress(address)}</div>
            </div>
          }
          buttonClasses={styles.walletButtonConnected + ' ' + styles.walletButtonDefault}
          modalContent={() => (
            <div className="py-5 font-medium leading-5">
              <BalancesSummary />

              <div className={styles.menuOption} onClick={onClickCopy}>
                <CopyIcon />
                <div>Copy Address</div>
              </div>
              <div className={styles.menuOption} onClick={onClickChangeNetwork}>
                <NetworkIcon />
                <div>Change Network</div>
              </div>
              <hr className="mx-5 mt-4" />
              <div className={styles.menuOption} onClick={onClickDisconnect}>
                <LogoutIcon />
                <div>Disconnect</div>
              </div>
            </div>
          )}
          modalClasses="right-px min-w-[272px] border-[1px] border-solid border-black text-sm !rounded-[16px] !shadow-lg2"
        />
      ) : (
        <SolidButton
          color="white"
          classes={styles.walletButtonDefault}
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
    <div className="flex items-center sm:mr-[12px]">
      <Image src={Wallet} alt="" width={20} height={20} />
    </div>
  )
}

function LogoutIcon() {
  return (
    <div className="flex items-center sm:mr-1.5">
      <Image src={Logout} alt="" width={32} height={32} />
    </div>
  )
}

function NetworkIcon() {
  return (
    <div className="flex items-center sm:mr-1.5">
      <Image src={Cube} alt="" width={32} height={32} />
    </div>
  )
}

function CopyIcon() {
  return (
    <div className="flex items-center sm:mr-1.5">
      <Image src={Clipboard} alt="" width={32} height={32} />
    </div>
  )
}

const styles = {
  // TODO DRY up with SolidButton styles
  walletButtonDefault:
    'shadow-md h-[52px] min-w-[137px] py-[16px] !pl-[20px] !pr-[24px] sm:px-4 rounded-lg border-[1px] border-solid border-black font-medium leading-5',
  walletButtonConnected:
    'flex items-center justify-center bg-white text-black hover:bg-gray-100 active:bg-gray-200 rounded-full shadow-md transition-all duration-300', //TODO: @bayo hover shadow needs to be adjusted for padding
  menuOption:
    'flex items-center cursor-pointer rounded hover:bg-gray-100 active:bg-gray-200 pl-4 pt-4',
}
