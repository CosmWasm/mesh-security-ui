import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@cosmos-kit/react'
import { ChakraProvider } from '@chakra-ui/react'
import { defaultTheme } from '../config'
import { assets, chains } from 'chain-registry'
import { getSigningCosmosClientOptions } from 'osmojs'
import { GasPrice } from '@cosmjs/stargate'

import { SignerOptions } from '@cosmos-kit/core'
import { Chain } from '@chain-registry/types'
import Layout from 'components/Layout'
import { MeshClientProvider } from 'client'
import { Toaster } from 'react-hot-toast'
import { TxProvider } from 'contexts/tx'
import { useEffect } from 'react'

import { wallets as keplr } from '@cosmos-kit/keplr'
import { wallets as leap } from '@cosmos-kit/leap'

function MeshSecurityApp({ Component, pageProps }: AppProps) {
  const signerOptions: SignerOptions = {
    stargate: (_chain: Chain) => {
      return getSigningCosmosClientOptions()
    },
    cosmwasm: (chain: Chain) => {
      switch (chain.chain_name) {
        case 'osmosis':
        case 'osmosistestnet':
          console.log('got osmosis')
          return {
            gasPrice: GasPrice.fromString('0.0025uosmo'),
          }
        case 'juno':
          return {
            gasPrice: GasPrice.fromString('0.0025ujuno'),
          }
        case 'junotestnet':
          return {
            gasPrice: GasPrice.fromString('0.0025ujunox'),
          }
      }
    },
  }

  useEffect(() => {}, [])

  return (
    <main className="dark">
      <ChakraProvider theme={defaultTheme}>
        <WalletProvider
          chains={chains}
          assetLists={assets}
          wallets={[...keplr, ...leap]}
          signerOptions={signerOptions}
          storageOptions={{
            disabled: true,
          }}
        >
          <Toaster position="bottom-center" />
          <MeshClientProvider>
            <TxProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </TxProvider>
          </MeshClientProvider>
        </WalletProvider>
      </ChakraProvider>
    </main>
  )
}

export default MeshSecurityApp
