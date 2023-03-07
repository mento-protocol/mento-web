import { toast } from 'react-toastify'
import { ChainMetadata, allChains, chainIdToChain } from 'src/config/chains'
import { reset as accountReset } from 'src/features/accounts/accountSlice'
import { reset as blockReset } from 'src/features/blocks/blockSlice'
import { resetTokenPrices } from 'src/features/chart/tokenPriceSlice'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { reset as swapReset } from 'src/features/swap/swapSlice'
import { HrDivider } from 'src/layout/HrDivider'
import { Modal } from 'src/layout/Modal'
import { logger } from 'src/utils/logger'
import { useChainId, useSwitchNetwork } from 'wagmi'

interface Props {
  isOpen: boolean
  close: () => void
}

export function NetworkModal({ isOpen, close }: Props) {
  const latestBlock = useAppSelector((s) => s.block.latestBlock)
  const chainId = useChainId()
  const currentChain = chainIdToChain[chainId]
  const { switchNetworkAsync } = useSwitchNetwork()

  const dispatch = useAppDispatch()
  const switchToNetwork = async (c: ChainMetadata) => {
    try {
      if (!switchNetworkAsync) throw new Error('switchNetworkAsync undefined')
      logger.debug('Resetting and switching to network', c.name)
      await switchNetworkAsync(c.chainId)
      dispatch(blockReset())
      dispatch(accountReset())
      dispatch(swapReset())
      dispatch(resetTokenPrices())
    } catch (error) {
      logger.error('Error updating network', error)
      toast.error('Could not switch network, does wallet support switching?')
    }
  }

  return (
    <Modal isOpen={isOpen} close={close} title="Network details" width="max-w-sm">
      <div className="relative flex flex-col items-center">
        <div className="flex justify-between items-center mt-3">
          <div className="mr-2 w-28 text-left text-sm">Connected to:</div>
          <div className="w-48 ml-1 text-sm">{currentChain?.name || 'Unknown'}</div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="mr-2 w-28 text-left text-sm">Block Number:</div>
          <div className="w-48 ml-1 text-sm">{latestBlock?.number || 'Unknown'}</div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="mr-2 w-28 text-left text-sm">Node Rpc Url:</div>
          <div className="w-48 ml-1 text-sm">{shortenUrl(currentChain?.rpcUrl) || 'Unknown'}</div>
        </div>
        <HrDivider classes="my-6" />
        <div className="flex items-center space-x-6 pb-2">
          {allChains.map((c) => (
            <button
              onClick={() => switchToNetwork(c)}
              key={c.chainId}
              className={`py-1.5 px-2 min-w-[4.5rem] rounded transition border border-gray-500 hover:border-green-700 hover:text-green-700 active:border-green-800 ${
                c.chainId === currentChain?.chainId && 'border-green-700 text-green-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}

function shortenUrl(url?: string) {
  try {
    if (!url) return null
    return new URL(url).hostname
  } catch (error) {
    logger.error('Error parsing url', error)
    return null
  }
}
