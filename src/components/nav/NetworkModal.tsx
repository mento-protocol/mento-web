import { Alfajores, Baklava, Mainnet, useContractKit } from '@celo-tools/use-contractkit'
import ReactModal from 'react-modal'
import { useAppSelector } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import XCircle from 'src/images/icons/x-circle.svg'
import { HrDivider } from 'src/layout/HrDivider'
import { logger } from 'src/utils/logger'

interface Props {
  isOpen: boolean
  close: () => void
}

export function NetworkModal({ isOpen, close }: Props) {
  const latestBlock = useAppSelector((s) => s.block.latestBlock)
  const { network, updateNetwork } = useContractKit()
  const allNetworks = [Mainnet, Alfajores, Baklava]

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      style={defaultModalStyles}
      overlayClassName="fixed bg-gray-100 bg-opacity-75 inset-0"
      contentLabel="Network details"
    >
      <div className="bg-white dark:bg-gray-800 p-5">
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-1 -right-1">
            <IconButton imgSrc={XCircle} title="Close" width={16} height={16} onClick={close} />
          </div>
          <h2 className="text-center text-lg font-medium">Network Details</h2>
          <div className="flex justify-between items-center mt-3">
            <div className="mr-2 w-40 text-right">Connected to:</div>
            <div className="w-40 ml-2">{network.name}</div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="mr-2 w-40 text-right">Block Number:</div>
            <div className="w-40 ml-2">{latestBlock?.number ?? 'Unknown'}</div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="mr-2 w-40 text-right">Node Rpc Url:</div>
            <div className="w-40 ml-2">{shortenUrl(network.rpcUrl) ?? 'Unknown'}</div>
          </div>
          <HrDivider classes="my-4" />
          <h3 className="text-center font-medium">Switch Network</h3>
          <div className="flex items-center space-x-6 mt-3">
            {allNetworks.map((n) => (
              <button
                onClick={() => updateNetwork(n)}
                key={n.chainId}
                className={`py-1.5 px-2 rounded transition border border-gray-500 hover:border-green-dark hover:text-green-dark active:border-green-darkest ${
                  n.chainId === network.chainId && 'border-green-dark text-green-dark'
                }`}
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

function shortenUrl(url: string) {
  try {
    if (!url) return null
    return new URL(url).hostname
  } catch (error) {
    logger.error('Error parsing url', error)
    return null
  }
}

export const defaultModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    border: 'unset',
    background: 'unset',
    padding: 'unset',
    borderRadius: 10,
    boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.15)',
  },
}
