import { useContractKit } from '@celo-tools/use-contractkit'
import Image from 'next/image'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { Identicon } from 'src/components/Identicon'
import Wallet from 'src/images/icons/wallet.svg'
import { shortenAddress } from 'src/utils/addresses'

export function ConnectButton() {
  const { connect, address } = useContractKit()

  return (
    <div className="flex justify-end mb-1">
      {address ? (
        <SolidButton size="l" classes="shadow-md pl-2 pr-2 sm:pr-4 sm:pl-2" onClick={connect}>
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
          classes="shadow-md px-3 sm:px-4"
          icon={<WalletIcon />}
          onClick={connect}
        >
          <div className="hidden sm:block">Connect</div>
        </SolidButton>
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
