import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { STATUS_POLLER_DELAY } from 'src/config/consts'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { fetchLatestBlock } from 'src/features/blocks/fetchLatestBlock'
import { useAppDispatch } from 'src/features/store/hooks'
import { logger } from 'src/utils/logger'
import { useInterval } from 'src/utils/timeout'
import { useAccount, useChainId } from 'wagmi'

export function PollingWorker() {
  const dispatch = useAppDispatch()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  // TODO debounce toast errors

  const onPoll = () => {
    dispatch(fetchLatestBlock({ chainId }))
      .unwrap()
      .catch((err) => {
        // toast.warn('Error retrieving latest block')
        logger.error('Failed to retrieve latest block', err)
      })
    if (address && isConnected) {
      dispatch(fetchBalances({ address, chainId }))
        .unwrap()
        .catch((err) => {
          toast.warn(`Can't retrieve account balances.\n Try to refresh the page`)
          logger.error('Unexpected error on retrieving balances', err)
        })
    }
  }

  useEffect(onPoll, [address, isConnected, chainId, dispatch])

  useInterval(onPoll, STATUS_POLLER_DELAY)

  return null
}
