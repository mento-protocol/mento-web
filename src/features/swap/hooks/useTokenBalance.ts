import { useFormikContext } from 'formik'
import { toast } from 'react-toastify'
import { TokenId, Tokens } from 'src/config/tokens'
import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { fromWei, fromWeiRounded } from 'src/utils/amount'
import { useAccount } from 'wagmi'

import { SwapFormValues } from '../types'

// Gets the user's token balances and checks if the user has enough balance to perform a swap
export function useTokenBalance(balances: AccountBalances, tokenId: TokenId) {
  const { isConnected } = useAccount()
  const { setFieldValue } = useFormikContext<SwapFormValues>()

  const balance = balances[tokenId]
  const roundedBalance = fromWeiRounded(balance, Tokens[tokenId].decimals)
  const hasBalance = Boolean(Number.parseFloat(roundedBalance) > 0)

  const useMaxBalance = () => {
    const maxAmount = fromWei(balance, Tokens[tokenId].decimals)
    setFieldValue('amount', maxAmount)
    setFieldValue('direction', 'in')

    if (tokenId === TokenId.CELO) {
      toast.warn('Consider keeping some CELO for transaction fees')
    }
  }

  return {
    balance: roundedBalance,
    hasBalance: isConnected && hasBalance,
    useMaxBalance,
  }
}
