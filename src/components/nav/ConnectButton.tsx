import { useConnectModal } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Identicon } from 'src/components/Identicon'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { BalancesSummary } from 'src/components/nav/BalancesSummary'
import { NetworkModal } from 'src/components/nav/NetworkModal'
import ClipboardDark from 'src/images/icons/clipboard-plus-dark.svg'
import Clipboard from 'src/images/icons/clipboard-plus.svg'
import CubeDark from 'src/images/icons/cube-dark.svg'
import Cube from 'src/images/icons/cube.svg'
import LogoutDark from 'src/images/icons/logout-dark.svg'
import Logout from 'src/images/icons/logout.svg'
import WalletDark from 'src/images/icons/wallet-dark.svg'
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
          buttonContent={() => (
            <div className="flex items-center">
              <Identicon address={address} size={26} />
              <div className="hidden sm:block ml-[12px]">{shortenAddress(address)}</div>
            </div>
          )}
          buttonClasses={styles.walletButtonConnected + ' ' + styles.walletButtonDefault}
          modalContent={() => (
            <div className="py-5 font-medium leading-5">
              <BalancesSummary />

              <div className={styles.menuOption} onClick={onClickCopy}>
                <CopyIcon />
                <div className="transition-colors duration-200 hover:text-gray-500 active:text-gray-200">
                  Copy Address
                </div>
              </div>
              <div className={styles.menuOption} onClick={onClickChangeNetwork}>
                <NetworkIcon />
                <div className="transition-colors duration-200 hover:text-gray-500 active:text-gray-200">
                  {' '}
                  Change Network
                </div>
              </div>
              <hr className="mx-5 mt-4 dark:border-[#333336]" />
              <div className={styles.menuOption} onClick={onClickDisconnect}>
                <LogoutIcon />
                <div className="transition-colors duration-200 dark:text-primary-blush hover:text-gray-500 active:text-gray-200">
                  Disconnect
                </div>
              </div>
            </div>
          )}
          modalClasses="right-px min-w-[272px] border-[1px] border-solid border-black dark:border-[#333336] text-sm !rounded-[16px] !shadow-lg2 dark:bg-[#1D1D20]/[1]"
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
      <Image className="inline dark:hidden" src={Wallet} alt="" width={20} height={20} />
      <Image className="hidden dark:inline" src={WalletDark} alt="" width={20} height={20} />
    </div>
  )
}

function LogoutIcon() {
  return (
    <div className="flex items-center sm:mr-1.5">
      <Image className="inline dark:hidden" src={Logout} alt="" width={32} height={32} />
      <Image className="hidden dark:inline" src={LogoutDark} alt="" width={32} height={32} />
    </div>
  )
}

function NetworkIcon() {
  return (
    <div className="flex items-center sm:mr-1.5">
      <Image className="inline dark:hidden" src={Cube} alt="" width={32} height={32} />
      <Image className="hidden dark:inline" src={CubeDark} alt="" width={32} height={32} />
    </div>
  )
}

function CopyIcon() {
  return (
    <div className="flex items-center sm:mr-1.5">
      <Image className="inline dark:hidden" src={Clipboard} alt="" width={32} height={32} />
      <Image className="hidden dark:inline" src={ClipboardDark} alt="" width={32} height={32} />
    </div>
  )
}

const styles = {
  // TODO DRY up with SolidButton styles
  walletButtonDefault:
    'shadow-md h-[52px] min-w-[137px] py-[16px] !pl-[20px] !pr-[24px] sm:px-4 rounded-lg border-[1px] border-solid border-black dark:border-clean-white font-medium leading-5 dark:text-white dark:bg-primary-dark',
  walletButtonConnected:
    'flex items-center justify-center bg-white text-black rounded-full shadow-md transition-all duration-300',
  menuOption: 'flex items-center cursor-pointer rounded pl-4 pt-4 dark:text-white',
}
