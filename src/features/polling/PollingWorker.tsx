import { useContractKit } from '@celo-tools/use-contractkit'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { STATUS_POLLER_DELAY } from 'src/config/consts'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { fetchLatestBlock } from 'src/features/blocks/fetchLatestBlock'
import { fetchConfig } from 'src/features/granda/fetchConfig'
import { fetchOracleRates } from 'src/features/granda/fetchOracleRates'
import { fetchProposals } from 'src/features/granda/fetchProposals'
import { fetchExchangeRates } from 'src/features/swap/fetchExchangeRates'
import { logger } from 'src/utils/logger'
import { useInterval } from 'src/utils/timeout'

export function PollingWorker() {
  const isGrandaActive = useAppSelector((s) => s.granda.isActive)
  const dispatch = useAppDispatch()
  const { address, kit, initialised } = useContractKit()

  const onPoll = () => {
    if (!kit || !initialised) return
    dispatch(fetchExchangeRates({ kit }))
      .unwrap()
      .catch((err) => {
        toast.error('Error retrieving exchange rates')
        logger.error('Failed to retrieve exchange rates', err)
      })
    dispatch(fetchLatestBlock({ kit }))
      .unwrap()
      .catch((err) => {
        toast.warn('Error retrieving latest block')
        logger.error('Failed to retrieve latest block', err)
      })
    if (isGrandaActive) {
      dispatch(fetchProposals({ kit }))
        .unwrap()
        .catch((err) => {
          toast.warn('Error retrieving Granda proposals')
          logger.error('Failed to retrieve granda proposals', err)
        })
      dispatch(fetchConfig({ kit }))
        .unwrap()
        .catch((err) => {
          toast.warn('Error retrieving Granda config')
          logger.error('Failed to retrieve granda config', err)
        })
      dispatch(fetchOracleRates({ kit }))
        .unwrap()
        .catch((err) => {
          toast.warn('Error retrieving oracle rates')
          logger.error('Failed to retrieve oracle rates', err)
        })
    }
    if (address) {
      dispatch(fetchBalances({ address, kit }))
        .unwrap()
        .catch((err) => {
          toast.error('Error retrieving account balances')
          logger.error('Failed to retrieve balances', err)
        })
    }
  }

  useEffect(onPoll, [isGrandaActive, address, kit, initialised, dispatch])

  useInterval(onPoll, STATUS_POLLER_DELAY)

  return null
}
