import cx from 'classnames'
import { toast } from 'react-toastify'
import { ChainMetadata, allChains, chainIdToChain } from 'src/config/chains'
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
    <Modal isOpen={isOpen} close={close} title="Network details" width="max-w-md">
      <div className="px-4 sm:px-6 w-full justify-between items-end inline-flex">
        <div className="w-full py-3 sm:py-4 bg-gray-100 dark:bg-zinc-900 rounded-xl font-inter border border-gray-200 dark:border-zinc-800 flex-col justify-start items-center gap-4 inline-flex">
          <div className="px-3 sm:px-4 w-full justify-between items-end inline-flex">
            <div className="text-neutral-500 dark:text-gray-400 text-[14px] sm:text-[15px] font-normal leading-tight">
              Connected to:
            </div>
            <div className="opacity-90 text-right text-gray-950 dark:text-white text-[15px] font-medium leading-tight">
              {currentChain?.name || 'Unknown'}
            </div>
          </div>
          <div className="w-full h-[0px] border-t border-gray-200 dark:border-zinc-800"></div>
          <div className="px-3 sm:px-4 w-full justify-between items-end inline-flex">
            <div className="text-neutral-500 dark:text-gray-400 text-[14px] sm:text-[15px] font-normal leading-tight">
              Block Number:
            </div>
            <div className="opacity-90 text-right text-gray-950 dark:text-white text-[14px] sm:text-[15px] font-medium leading-tight">
              {latestBlock?.number || 'Unknown'}
            </div>
          </div>
          <div className="w-full h-[0px] border-t border-gray-200 dark:border-zinc-800"></div>
          <div className="px-3 sm:px-4 w-full justify-between items-end inline-flex">
            <div className="text-neutral-500 dark:text-gray-400 text-[14px] sm:text-[15px] font-normal leading-tight">
              Node Rpc Url:
            </div>
            <div className="opacity-90 text-right text-gray-950 dark:text-white text-[14px] sm:text-[15px] font-medium leading-tight">
              {shortenUrl(currentChain?.rpcUrl) || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 w-full h-[0px] border-t border-gray-200 dark:border-zinc-800"></div>
      <div className="py-4 sm:py-6 px-4 sm:px-6 w-full justify-start items-start gap-4 inline-flex font-inter">
        {allChains.map((c) => (
          <button
            onClick={() => switchToNetwork(c)}
            key={c.chainId}
            className={cx(
              'grow shrink basis-0 h-[42px] sm:h-[50px] px-4 py-3',
              'rounded-lg border border-gray-950',
              'text-[14px] sm:text-[16px] font-semibold leading-relaxed',
              'justify-center items-center flex',
              c.chainId === currentChain.chainId
                ? 'bg-cyan-200 border-gray-950 text-gray-950 dark:border-cyan-200 dark:bg-transparent dark:text-cyan-200'
                : 'dark:bg-zinc-600 dark:border-zinc-600 dark:text-white',
              'active:bg-cyan-200 hover:bg-cyan-200 active:border-cyan-200',
              'dark:active:border-zinc-800 dark:hover:border-cyan-200'
            )}
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
          <div className="justify-start items-center gap-1 flex">
            <div className="text-gray-950 text-[16px] font-semibold leading-relaxed">Baklava</div>
          </div>
        </div>


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
