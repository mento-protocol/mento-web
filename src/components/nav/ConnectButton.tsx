import { useContractKit } from '@celo-tools/use-contractkit'
import Image from 'next/image'
import { SolidButton } from 'src/components/buttons/SolidButton'
import Wallet from 'src/images/icons/wallet.svg'

export function ConnectButton() {
  const { connect, address } = useContractKit()

  return (
    <div className="flex justify-end w-60">
      {address ? (
        <div>{address}</div>
      ) : (
        <SolidButton size="l" classes="shadow-md" icon={<WalletIcon />} onClick={connect}>
          Connect
        </SolidButton>
      )}
    </div>
  )
}

function WalletIcon() {
  return (
    <div className="flex items-center mr-2">
      <Image src={Wallet} alt="Wallet" width={18} height={18} />
    </div>
  )
}
