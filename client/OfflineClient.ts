import type { RpcInfo } from 'util/chain'
import { MeshClient } from 'client/core'
import { chains } from 'chain-registry'
import denom from 'config/denom'
import { getRpc } from 'util/chain'

const client = async (chainName: string) => {
  const chainData = chains.find((c) => c.chain_name === chainName)
  const chainDenom = denom.find((d) => d.chain === chainName)?.denom!
  const rpc = await getRpc(chainData?.apis?.rpc as RpcInfo[])
  return new MeshClient({
    wallet: null,
    signingCosmWasmClient: null,
    chain: {
      name: chainName,
      denom: chainDenom as string,
      rpc: rpc as string,
    },
  })
}

export default client
