import { isEmpty } from 'lodash'

export interface RpcInfo {
  address: string
  provider: string
}

export const Timeout = (time: number) => {
  let controller = new AbortController()
  setTimeout(() => controller.abort(), time)
  return controller
}

export async function getRpc(rpcs: RpcInfo[]) {
  EndpointLoop: for (const endpoint of rpcs) {
    try {
      console.log('Trying endpoint', endpoint.address)
      const response = await fetch(endpoint.address, {
        signal: Timeout(1500).signal,
      })
      if (response.status == 200) {
        return endpoint.address
      }
    } catch (err) {
      console.log(`Failed to fetch RPC ${endpoint.address}`)
    }
  }
  return undefined
}
