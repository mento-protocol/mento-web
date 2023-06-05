import { TokenId, Tokens } from 'src/config/tokens'

import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { fromWeiRounded } from 'src/utils/amount'
import { useAppSelector } from 'src/features/store/hooks'

export function BalancesSummary() {
  const balances = useAppSelector((s) => s.account.balances)
  const tokenIds = Object.keys(balances) as TokenId[]

  return (
    <div className="flex flex-wrap">
      {tokenIds.map((id) => (
        <div style={{ minWidth: '35%' }} className="flex mx-2 my-2" key={id}>
          <TokenIcon token={Tokens[id]} size="xs" />
          <div className="ml-1">{fromWeiRounded(balances[id], Tokens[id].decimals)}</div>
        </div>
      ))}
    </div>
  )
}
