import type { MeshLockupClient } from 'codegen/MeshLockup.client'
import { MeshLockupMessageComposer } from 'codegen/MeshLockup.message-composer'

export interface GenerateBondMsgArgs {
  sender: string
  meshLockupClient: MeshLockupClient
}

export default function generateBondMsg(
  amount: number,
  denom: string,
  { sender, meshLockupClient }: GenerateBondMsgArgs,
) {
  const meshLockupComposer = new MeshLockupMessageComposer(
    sender,
    meshLockupClient.contractAddress,
  )

  const msg = meshLockupComposer.bond([
    { amount: amount.toString(), denom: denom },
  ])

  return msg
}
