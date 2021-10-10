import { useContractKit } from '@celo-tools/use-contractkit'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch } from 'src/app/hooks'
import { STATUS_POLLER_DELAY } from 'src/config/consts'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { fetchLatestBlock } from 'src/features/blocks/fetchLatestBlock'
import { fetchExchangeRates } from 'src/features/swap/fetchExchangeRates'
import { logger } from 'src/utils/logger'
import { useInterval } from 'src/utils/timeout'

export function PollingWorker() {
  const dispatch = useAppDispatch()
  const { address, kit, initialised } = useContractKit()

  const onPoll = () => {
    if (!kit || !initialised) return
    dispatch(fetchExchangeRates({ kit })).catch((err) => {
      toast.error('Error retrieving exchange rates')
      logger.error('Failed to retrieve exchange rates', err)
    })
    dispatch(fetchLatestBlock({ kit })).catch((err) => {
      toast.warn('Error retrieving latest block')
      logger.error('Failed to retrieve latest block', err)
    })
    if (address) {
      dispatch(fetchBalances({ address, kit })).catch((err) => {
        toast.error('Error retrieving account balances')
        logger.error('Failed to retrieve balances', err)
      })
    }
  }

  useEffect(onPoll, [address, kit, initialised, dispatch])

  useInterval(onPoll, STATUS_POLLER_DELAY)

  return null
}
