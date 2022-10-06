import type { RpcInfo } from 'util/chain'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MeshClient } from 'client/core'
import MeshContext from './MeshContext'
import { chains } from 'chain-registry'
import { useWallet } from '@cosmos-kit/react'
import denom from 'config/denom'
import { getRpc } from 'util/chain'

export default function MeshClientProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [, updateState] = useState<{}>()
  const forceUpdate = useCallback(() => updateState({}), [])

  const [client, setClient] = useState<MeshClient | null>(null)

  const { currentChainName, currentWallet } = useWallet()

  const currentChain = useMemo(
    () => chains.find((c) => c.chain_name === currentChainName),
    [currentChainName],
  )

  useEffect(() => {
    async function effect() {
      if (!currentChain) return
      let signingCosmWasmClient, balance, chainDenom
      if (currentWallet) {
        signingCosmWasmClient = await currentWallet.getCosmWasmClient()
        chainDenom = denom.find((d) => d.chain === currentChainName)?.denom!
        balance = await signingCosmWasmClient?.getBalance(
          currentWallet?.address,
          chainDenom,
        )
      }

      const rpc = await getRpc(currentChain?.apis?.rpc as RpcInfo[])

      const client = new MeshClient({
        wallet: currentWallet
          ? {
              address: currentWallet.address,
              name: currentWallet.username,
              balance,
            }
          : null,
        chain: {
          name: currentChainName,
          denom: chainDenom as string,
          rpc: rpc as string,
        },
        signingCosmWasmClient: signingCosmWasmClient || null,
      })

      client?.connect()

      setClient(client)
    }

    effect()
  }, [currentWallet, currentChain])

  const connectSigning = useCallback(async () => {
    if (client) {
      client?.connectSigning()
      forceUpdate()
    }
  }, [client, forceUpdate])

  // Connect client
  useEffect(() => {
    // Unsigned Client
    async function connectClient() {
      await client?.connect()
      forceUpdate()
    }

    connectClient()
  }, [client, forceUpdate])

  return (
    <MeshContext.Provider
      value={{
        client,
        connectSigning,
      }}
    >
      {children}
    </MeshContext.Provider>
  )
}
