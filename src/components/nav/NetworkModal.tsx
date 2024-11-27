import { toast } from 'react-toastify'
import { ChainMetadata, allChains, chainIdToChain } from 'src/config/chains'
import { cleanupStaleWalletSessions } from 'src/config/wallets'
import { reset as accountReset } from 'src/features/accounts/accountSlice'
import { reset as blockReset } from 'src/features/blocks/blockSlice'
import { resetTokenPrices } from 'src/features/chart/tokenPriceSlice'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { reset as swapReset } from 'src/features/swap/swapSlice'
import { Modal } from 'src/layout/Modal'
import { logger } from 'src/utils/logger'
import { useChainId, useSwitchNetwork } from 'wagmi'

interface Props {
  isOpen: boolean
  close: () => void
}

export function NetworkModal({ isOpen, close }: Props) {
  const baseLocator = 'networkModal'
  const latestBlock = useAppSelector((s) => s.block.latestBlock)
  const chainId = useChainId()
  const currentChain = chainIdToChain[chainId]
  const { switchNetworkAsync } = useSwitchNetwork()

  const dispatch = useAppDispatch()
  const switchToNetwork = async (c: ChainMetadata) => {
    try {
      if (!switchNetworkAsync) throw new Error('switchNetworkAsync undefined')
      logger.debug('Resetting and switching to network', c.name)
      cleanupStaleWalletSessions()
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
    <Modal isOpen={isOpen} close={close} title="Network details" width="max-w-md">
      <div className="inline-flex items-end justify-between w-full px-4 sm:px-6">
        <div className="inline-flex flex-col items-center justify-start w-full gap-4 py-3 bg-gray-100 border border-gray-200 sm:py-4 dark:bg-zinc-900 rounded-xl font-inter dark:border-zinc-800">
          <div className="inline-flex items-end justify-between w-full px-3 sm:px-4">
            <div className="text-neutral-500 dark:text-gray-400 text-[14px] sm:text-[15px] font-normal leading-tight">
              Connected to:
            </div>
            <div
              className="opacity-90 text-right text-gray-950 dark:text-white text-[15px] font-medium leading-tight"
              data-testid={`${baseLocator}_currentNetwork`}
            >
              {currentChain?.name || 'Unknown'}
            </div>
          </div>
          <div className="w-full h-[0px] border-t border-gray-200 dark:border-zinc-800"></div>
          <div className="inline-flex items-end justify-between w-full px-3 sm:px-4">
            <div className="text-neutral-500 dark:text-gray-400 text-[14px] sm:text-[15px] font-normal leading-tight">
              Block Number:
            </div>
            <div
              className="opacity-90 text-right text-gray-950 dark:text-white text-[14px] sm:text-[15px] font-medium leading-tight"
              data-testid={`${baseLocator}_currentBlockNumber`}
            >
              {latestBlock?.number || 'Unknown'}
            </div>
          </div>
          <div className="w-full h-[0px] border-t border-gray-200 dark:border-zinc-800"></div>
          <div className="inline-flex items-end justify-between w-full px-3 sm:px-4">
            <div className="text-neutral-500 dark:text-gray-400 text-[14px] sm:text-[15px] font-normal leading-tight">
              Node Rpc Url:
            </div>
            <div
              className="opacity-90 text-right text-gray-950 dark:text-white text-[14px] sm:text-[15px] font-medium leading-tight"
              data-testid={`${baseLocator}_currentNodeRpcUrl`}
            >
              {shortenUrl(currentChain?.rpcUrl) || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 w-full h-[0px] border-t border-gray-200 dark:border-zinc-800"></div>
      <div className="inline-flex items-start justify-start w-full gap-4 px-4 py-4 sm:py-6 sm:px-6 font-inter">
        {allChains.map((c) => (
          <button
            onClick={() => switchToNetwork(c)}
            key={c.chainId}
            className={`
              grow shrink basis-0 h-[42px] sm:h-[50px] px-4 py-3
              rounded-lg border border-gray-950
              text-[14px] sm:text-[16px] font-semibold leading-relaxed
              justify-center items-center flex
             ${
               c.chainId === currentChain.chainId
                 ? 'bg-cyan-200 border-gray-950 text-gray-950 dark:border-cyan-200 dark:bg-transparent dark:text-cyan-200'
                 : 'dark:bg-zinc-600 dark:border-zinc-600 dark:text-white'
             }
              active:bg-cyan-200 hover:bg-cyan-200 active:border-cyan-200
              dark:active:border-zinc-800 dark:hover:border-cyan-200
            `}
          >
            {c.name}
          </button>
        ))}
      </div>
    </Modal>
  )
}
/*
        <div className="grow shrink basis-0 h-[50px] px-4 py-3 rounded-lg border border border border border-gray-950 justify-center items-center flex">
          <div className="flex items-center justify-start gap-1">
            <div className="text-gray-950 text-[16px] font-semibold leading-relaxed">Baklava</div>
          </div>
        </div>


      <div className="relative flex flex-col items-center">
        <div className="flex items-center justify-between mt-3">
          <div className="mr-2 text-sm text-left w-28">Connected to:</div>
          <div className="w-48 ml-1 text-sm">{currentChain?.name || 'Unknown'}</div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="mr-2 text-sm text-left w-28">Block Number:</div>
          <div className="w-48 ml-1 text-sm">{latestBlock?.number || 'Unknown'}</div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="mr-2 text-sm text-left w-28">Node Rpc Url:</div>
          <div className="w-48 ml-1 text-sm">{shortenUrl(currentChain?.rpcUrl) || 'Unknown'}</div>
        </div>
        <HrDivider classes="my-6" />
        <div className="flex items-center pb-2 space-x-6">
          {allChains.map((c) => (
            <button
              onClick={() => switchToNetwork(c)}
              key={c.chainId}
              className={`py-1.5 px-2 min-w-[4.5rem] rounded 
              transition border border-gray-500 hover:border-green-700 hover:text-green-700 
              active:border-green-800 ${c.chainId === currentChain?.chainId && 'border-green-700 text-green-700'
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
*/

function shortenUrl(url?: string) {
  try {
    if (!url) return null
    return new URL(url).hostname
  } catch (error) {
    logger.error('Error parsing url', error)
    return null
  }
}
