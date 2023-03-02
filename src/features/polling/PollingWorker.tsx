import { useCelo } from '@celo/react-celo'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { STATUS_POLLER_DELAY } from 'src/config/consts'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { fetchLatestBlock } from 'src/features/blocks/fetchLatestBlock'
import { useAppDispatch } from 'src/features/store/hooks'
import { logger } from 'src/utils/logger'
import { useInterval } from 'src/utils/timeout'

export function PollingWorker() {
  const dispatch = useAppDispatch()
  const { address, kit, initialised } = useCelo()

  // TODO debounce toast errors

  const onPoll = () => {
    if (!kit || !initialised) return
    dispatch(fetchLatestBlock({ kit }))
      .unwrap()
      .catch((err) => {
        // toast.warn('Error retrieving latest block')
        logger.error('Failed to retrieve latest block', err)
      })
    if (address) {
      dispatch(fetchBalances({ address, kit }))
        .unwrap()
        .catch((err) => {
          toast.warn('Error retrieving account balances')
          logger.error('Failed to retrieve balances', err)
        })
    }
  }

  useEffect(onPoll, [address, kit, initialised, dispatch])

  useInterval(onPoll, STATUS_POLLER_DELAY)

  return null
}
