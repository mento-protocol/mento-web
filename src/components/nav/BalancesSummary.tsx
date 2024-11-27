import { TokenId, Tokens } from 'src/config/tokens'
import { useAppSelector } from 'src/features/store/hooks'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { fromWeiRounded } from 'src/utils/amount'

export function BalancesSummary() {
  const balances = useAppSelector((s) => s.account.balances)
  const tokenIds = Object.keys(balances) as TokenId[]

  return (
    <>
      <div className="flex flex-col pl-5">
        {tokenIds.map((id) => {
          const balance = fromWeiRounded(balances[id], Tokens[id].decimals)
          if (balance !== '0') {
            const token = Tokens[id]
            // TODO: @bayo Either revert this !== 0 check or add some animation for when balances are loading
            return (
              <div
                style={{ minWidth: '35%' }}
                className="flex pb-4 dark:text-white"
                key={id}
                data-testid={`walletSettings_${token.id}_balance`}
              >
                <TokenIcon token={token} size="xs" />
                <div className="ml-3">{balance}</div>
              </div>
            )
          }
          return null
        })}
      </div>
      <hr className="dark:border-[#333336]" />
    </>
  )
}
