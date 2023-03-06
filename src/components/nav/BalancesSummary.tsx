import { TokenId, Tokens } from 'src/config/tokens'
import { useAppSelector } from 'src/features/store/hooks'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { fromWeiRounded } from 'src/utils/amount'

export function BalancesSummary() {
  const balances = useAppSelector((s) => s.account.balances)
  const tokenIds = Object.keys(balances) as TokenId[]

  return (
    <div className="flex flex-wrap">
      {tokenIds.map((id) => (
        <div style={{ minWidth: '35%' }} className="flex mx-2 my-2" key={id}>
          <TokenIcon token={Tokens[id]} size="xs" />
          <div className="ml-1">{fromWeiRounded(balances[id])}</div>
        </div>
      ))}
    </div>
  )
}
