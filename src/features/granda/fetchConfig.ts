import type { ContractKit } from '@celo/contractkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { kitContractToNativeToken } from 'src/config/tokenMapping'
import { GrandaConfig, SizeLimits } from 'src/features/granda/types'
import { isValidAddress } from 'src/utils/addresses'
import { toWei } from 'src/utils/amount'
import { logger } from 'src/utils/logger'

interface FetchConfigParams {
  kit: ContractKit
}

export const fetchConfig = createAsyncThunk<
  GrandaConfig | null,
  FetchConfigParams,
  { dispatch: AppDispatch; state: AppState }
>('granda/fetchConfig', async (params, thunkAPI) => {
  const { kit } = params
  const config = thunkAPI.getState().granda.config
  if (!config) {
    logger.debug('Fetching granda config')
    return _fetchConfig(kit)
  } else {
    return null
  }
})

async function _fetchConfig(kit: ContractKit): Promise<GrandaConfig> {
  const contract = await kit.contracts.getGrandaMento()
  const rawConfig = await contract.getConfig()

  const approver = rawConfig.approver
  if (!approver || !isValidAddress(approver)) throw new Error(`Invalid approver: ${approver}`)

  const spread = rawConfig.spread.toNumber()
  if (spread > 0.05 || spread < 0) throw new Error(`Invalid spread: ${spread}`)

  const vetoPeriodSeconds = rawConfig.vetoPeriodSeconds.toNumber()
  if (vetoPeriodSeconds > 2592000 || vetoPeriodSeconds < 1000)
    throw new Error(`Invalid veto period: ${vetoPeriodSeconds}`)

  const maxApprovalExchangeRateChange = rawConfig.maxApprovalExchangeRateChange.toNumber()
  if (maxApprovalExchangeRateChange > 0.9 || maxApprovalExchangeRateChange < 0.01)
    throw new Error(`Invalid approval exchange rate: ${maxApprovalExchangeRateChange}`)

  const exchangeLimits: SizeLimits = {}
  for (const [name, limits] of rawConfig.exchangeLimits.entries()) {
    const tokenId = kitContractToNativeToken(name)
    const min = limits.minExchangeAmount
    const max = limits.maxExchangeAmount
    if (min.lt(toWei(1))) throw new Error(`Invalid exchange min: ${min}`)
    if (max.lt(toWei(1_000_000))) throw new Error(`Invalid exchange max: ${max}`)
    exchangeLimits[tokenId] = {
      min: min.toFixed(0),
      max: max.toFixed(0),
    }
  }
  return {
    approver,
    spread,
    vetoPeriodSeconds,
    maxApprovalExchangeRateChange,
    exchangeLimits,
  }
}
