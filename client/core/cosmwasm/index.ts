import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export default async function connectCosmWasmClient(rpc: string) {
  if (!rpc) {
    throw new Error('No RPC provided to connect the CosmWasmClient.')
  }
  console.log('CosmWasmClient RPC', rpc)
  return await CosmWasmClient.connect(rpc)
}
