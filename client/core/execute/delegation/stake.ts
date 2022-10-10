import type { MeshLockupClient } from 'codegen/MeshLockup.client'
import { MeshLockupMessageComposer } from 'codegen/MeshLockup.message-composer'
import { osmoContracts } from 'config'

export interface GenerateStakeMsgArgs {
  sender: string
  meshLockupClient: MeshLockupClient
}

export default function generateStakeMsg(
  amount: number,
  validator: string,
  { sender, meshLockupClient }: GenerateStakeMsgArgs,
) {
  const meshLockupComposer = new MeshLockupMessageComposer(
    sender,
    meshLockupClient.contractAddress,
  )

  const msg = meshLockupComposer.grantClaim({
    amount: amount.toString(),
    leinholder: osmoContracts.meshProviderAddr,
    validator,
  })

  return msg
}
