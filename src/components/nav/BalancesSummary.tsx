import { useAppSelector } from 'src/app/hooks'
import { NativeTokenId, NativeTokens } from 'src/config/tokens'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { fromWeiRounded } from 'src/utils/amount'

export function BalancesSummary() {
  const balances = useAppSelector((s) => s.account.balances)
  const tokenIds = Object.keys(balances) as NativeTokenId[]

  return (
    <div className="flex flex-wrap">
      {tokenIds.map((id) => (
        <div className="flex ml-2 mr-3 my-2" key={id}>
          <TokenIcon token={NativeTokens[id]} size="xs" />
          <div className="ml-1">{fromWeiRounded(balances[id])}</div>
        </div>
      ))}
    </div>
  )
}
