import ReactModal from 'react-modal'
import { toast } from 'react-toastify'
import { IconButton } from 'src/components/buttons/IconButton'
import { reset as accountReset } from 'src/features/accounts/accountSlice'
import { reset as blockReset } from 'src/features/blocks/blockSlice'
import { resetTokenPrices } from 'src/features/chart/tokenPriceSlice'
import { useAppDispatch, useAppSelector } from 'src/features/store/hooks'
import { reset as swapReset } from 'src/features/swap/swapSlice'
import XCircle from 'src/images/icons/x-circle.svg'
import { HrDivider } from 'src/layout/HrDivider'
import { defaultModalStyles } from 'src/styles/modals'
import { logger } from 'src/utils/logger'
import { Chain, useNetwork, useSwitchNetwork } from 'wagmi'

interface Props {
  isOpen: boolean
  close: () => void
}

export function NetworkModal({ isOpen, close }: Props) {
  const latestBlock = useAppSelector((s) => s.block.latestBlock)
  const { chain: currentChain, chains } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  // const allNetworks = [Mainnet, Alfajores, Baklava]

  const dispatch = useAppDispatch()
  const switchToNetwork = async (c: Chain) => {
    try {
      if (!switchNetworkAsync) return
      logger.debug('Resetting and switching to network', c.name)
      await switchNetworkAsync(c.id)
      dispatch(blockReset())
      dispatch(accountReset())
      dispatch(swapReset())
      dispatch(resetTokenPrices())
    } catch (error) {
      // TODO fix use-ck so it throws on update fail (i.e due to metamask)
      logger.error('Error updating network', error)
      toast.error('Could not switch network, is Metamask using the right network?')
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      style={defaultModalStyles}
      overlayClassName="fixed bg-gray-100 bg-opacity-75 inset-0"
      contentLabel="Network details"
    >
      <div className="bg-white p-5">
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-1 -right-1">
            <IconButton imgSrc={XCircle} title="Close" width={16} height={16} onClick={close} />
          </div>
          <h2 className="text-center text-lg font-medium">Network Details</h2>
          <div className="flex justify-between items-center mt-3">
            <div className="mr-2 w-40 text-right">Connected to:</div>
            <div className="w-40 ml-2">{currentChain?.name || 'Unknown'}</div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="mr-2 w-40 text-right">Block Number:</div>
            <div className="w-40 ml-2">{latestBlock?.number || 'Unknown'}</div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="mr-2 w-40 text-right">Node Rpc Url:</div>
            <div className="w-40 ml-2">
              {shortenUrl(currentChain?.rpcUrls.default.http[0]) || 'Unknown'}
            </div>
          </div>
          <HrDivider classes="my-4" />
          <h3 className="text-center font-medium">Switch Network</h3>
          <div className="flex items-center space-x-6 mt-3">
            {chains.map((c) => (
              <button
                onClick={() => switchToNetwork(c)}
                key={c.id}
                className={`py-1.5 px-2 min-w-[4.5rem] rounded transition border border-gray-500 hover:border-green-700 hover:text-green-700 active:border-green-800 ${
                  c.id === currentChain?.id && 'border-green-700 text-green-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ReactModal>
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
