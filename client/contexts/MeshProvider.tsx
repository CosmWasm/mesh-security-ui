import type { RpcInfo } from 'util/chain'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChainName, MeshClient } from 'client/core'
import MeshContext from './MeshContext'
import { chains } from 'chain-registry'
import { useWallet } from '@cosmos-kit/react'
import denom from 'config/denom'
import { getRpc } from 'util/chain'
import { useRouter } from 'next/router'

export default function MeshClientProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [, updateState] = useState<{}>()
  const forceUpdate = useCallback(() => updateState({}), [])

  const router = useRouter()

  const [client, setClient] = useState<MeshClient | null>(null)

  const { currentChainName, currentWallet, setCurrentChain } = useWallet()

  const currentChain = useMemo(
    () => chains.find((c) => c.chain_name === currentChainName),
    [currentChainName],
  )

  const navigation = useMemo(
    () => [
      {
        name: 'Provider',
        href: '/provider',
        current: router.asPath === '/provider',
        chain: 'osmosistestnet',
      },
      {
        name: 'Consumer',
        href: '/consumer',
        current: router.asPath === '/consumer',
        chain: 'junotestnet',
      },
    ],
    [router.asPath],
  )

  useEffect(() => {
    async function effect() {
      if (!currentChain || !navigation) return
      setCurrentChain(navigation.find((n) => n.current)?.chain)
      let signingCosmWasmClient, balance, chainDenom
      if (currentWallet) {
        signingCosmWasmClient = await currentWallet.getCosmWasmClient()
        chainDenom = denom.find((d) => d.chain === currentChainName)?.denom!
        balance = await signingCosmWasmClient?.getBalance(
          currentWallet?.address,
          chainDenom,
        )
      }

      console.log('FETCHED BALANCE', balance)

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

      client?.connect(currentChainName as ChainName)

      setClient(client)
    }

    effect()
  }, [currentWallet, currentChain, router.asPath])

  const connectSigning = useCallback(async () => {
    if (client) {
      client?.connectSigning(currentChainName as ChainName)
      forceUpdate()
    }
  }, [client, forceUpdate])

  // Connect client
  useEffect(() => {
    // Unsigned Client
    async function connectClient() {
      await client?.connect(currentChainName as ChainName)
      forceUpdate()
    }

    connectClient()
  }, [client, forceUpdate])

  return (
    <MeshContext.Provider
      value={{
        client,
        connectSigning,
        navigation,
      }}
    >
      {children}
    </MeshContext.Provider>
  )
}
