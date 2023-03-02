import { CeloContract } from '@celo/contractkit'
import { newSortedOracles } from '@celo/contractkit/lib/generated/SortedOracles'
import { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { SortedOraclesWrapper } from '@celo/contractkit/lib/wrappers/SortedOracles'

let oracles: SortedOraclesWrapper
let lastChainId: number

// TODO remove
export async function getSortedOracles(kit: MiniContractKit): Promise<SortedOraclesWrapper> {
  const currentChainId = await kit.connection.chainId()
  if (oracles && lastChainId === currentChainId) {
    return oracles
  } else {
    lastChainId = currentChainId
  }

  const sortedOraclesAddress = await kit.registry.addressFor(CeloContract.SortedOracles)

  const contract = newSortedOracles(kit.connection.web3, sortedOraclesAddress)

  oracles = new SortedOraclesWrapper(kit.connection, contract, kit.registry)

  return oracles
}
