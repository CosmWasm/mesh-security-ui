import { Coin } from 'cosmwasm'

export interface WalletData {
  readonly address: string
  readonly name?: string
  readonly balance?: Coin
}
