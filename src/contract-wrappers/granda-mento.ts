import { CeloContract } from '@celo/contractkit'
import { newGrandaMento } from '@celo/contractkit/lib/generated/GrandaMento'
import { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { GrandaMentoWrapper } from '@celo/contractkit/lib/wrappers/GrandaMento'

let grandaMento: GrandaMentoWrapper
let lastChainId: number

export async function getGrandaMento(kit: MiniContractKit): Promise<GrandaMentoWrapper> {
  const currentChainId = await kit.connection.chainId()
  if (grandaMento && lastChainId === currentChainId) {
    return grandaMento
  } else {
    lastChainId = currentChainId
  }

  const grandaMentoAddress = await kit.registry.addressFor(CeloContract.GrandaMento)

  const contract = newGrandaMento(kit.connection.web3, grandaMentoAddress)

  grandaMento = new GrandaMentoWrapper(kit.connection, contract)

  return grandaMento
}
