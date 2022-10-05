import type { MeshProviderClient } from 'codegen/MeshProvider.client'
import { MeshProviderMessageComposer } from 'codegen/MeshProvider.message-composer'

export interface GenerateUnstakeMsgArgs {
  sender: string
  meshProviderClient: MeshProviderClient
}

export default function generateStakeMsg(
  amount: number,
  validator: string,
  { sender, meshProviderClient }: GenerateUnstakeMsgArgs,
) {
  const meshProviderComposer = new MeshProviderMessageComposer(
    sender,
    meshProviderClient.contractAddress,
  )

  const msg = meshProviderComposer.unstake({
    amount: amount.toString(),
    validator,
  })

  return msg
}
