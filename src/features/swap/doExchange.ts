// import type { ContractKit } from '@celo/contractkit'
// import { StableToken } from '@celo/contractkit'
// import { createAsyncThunk } from '@reduxjs/toolkit'
// import BigNumber from 'bignumber.js'
// import type { AppDispatch, AppState } from 'src/app/store'
// import { EXCHANGE_RATE_STALE_TIME, MAX_EXCHANGE_SPREAD } from 'src/config/consts'
// import { NativeTokenId, StableTokenIds } from 'src/config/tokens'
// import { getExchangeContract } from 'src/features/swap/contracts'
// import { ExchangeRate, SwapFormValues, ToCeloRates } from 'src/features/swap/types'
// import { toWei } from 'src/utils/amount'
// import { isStale } from 'src/utils/time'

// interface DoExchangeParams {
//   kit: ContractKit
// 	values: SwapFormValues
// }

// export const doExchange = createAsyncThunk<
//   string,
//   DoExchangeParams,
//   { dispatch: AppDispatch; state: AppState }
// >('swap/doExchange', async (params) => {
//   const { kit, values} = params
// 	const txHash = await _doExchange(kit, values)
// 	return txHash
// })

// async function _doExchange(
//   kit: ContractKit,
// 	values: SwapFormValues
// ): Promise<string> {
// 	const {fromTokenId, toTokenId, fromAmount} = values
// 	const stableTokenId =
//     fromTokenId === NativeTokenId.CELO ? toTokenId : fromTokenId
// 		const sellGold = fromTokenId === NativeTokenId.CELO
// 	const contract = await getExchangeContract(kit, stableTokenId)
// 	const amountInWei = toWei(values.fromAmount)
// 	// TODO adjust amount based on balance
// 	// TODO actual minBuyAmount
// 	const minBuyAmount = new BigNumber(amountInWei).multipliedBy(0.98)
// 	const tx = await contract.sell(amountInWei, minBuyAmount, sellGold)
// 	await tx.sendAndWaitForReceipt()
// }
