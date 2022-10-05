import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { WalletData } from './wallet'
import connectCosmWasmClient from './cosmwasm'
import { ChainData } from './chain'
import { MeshConsumerQueryClient } from 'codegen/MeshConsumer.client'
import {
  MeshLockupClient,
  MeshLockupQueryClient,
} from 'codegen/MeshLockup.client'
import {
  MeshProviderClient,
  MeshProviderQueryClient,
} from 'codegen/MeshProvider.client'
import {
  MeshSlasherClient,
  MeshSlasherQueryClient,
} from 'codegen/MeshSlasher.client'
import {
  MetaStakingClient,
  MetaStakingQueryClient,
} from 'codegen/MetaStaking.client'

import { junoContracts, osmoContracts } from 'config'

export interface MeshClientConstructor {
  wallet: WalletData | null
  chain: ChainData
  signingCosmWasmClient: SigningCosmWasmClient | null
}

export class MeshClient {
  private _cosmWasmClient: CosmWasmClient | null = null
  public signingCosmWasmClient: SigningCosmWasmClient | null = null

  private _meshConsumerClient: MeshConsumerQueryClient | null = null

  private _meshLockupClient: MeshLockupQueryClient | null = null
  public signingMeshLockupClient: MeshLockupClient | null = null

  private _meshProviderClient: MeshProviderQueryClient | null = null
  public signingMeshProviderClient: MeshProviderClient | null = null

  private _meshSlasherClient: MeshSlasherQueryClient | null = null
  public signingMeshSlasherClient: MeshSlasherClient | null = null

  private _metaStakingClient: MetaStakingQueryClient | null = null
  public signingMetaStakingClient: MetaStakingClient | null = null

  public chain: ChainData

  private _wallet: WalletData | null = null

  constructor({ wallet, chain, signingCosmWasmClient }: MeshClientConstructor) {
    this._wallet = wallet
    this.chain = chain
    this.signingCosmWasmClient = signingCosmWasmClient
  }

  public async connect() {
    // CosmWasm client already exists!
    if (this._cosmWasmClient) {
      return
    }

    // Create CosmWasm client
    this._cosmWasmClient = await connectCosmWasmClient(this.chain.rpc)

    // Create all contract clients
    await this.createContractClients()
  }

  // Asynchronously init every client at the same time
  private async createContractClients() {
    const initClients = [
      this.createMeshConsumerClient,
      this.createMeshLockupClient,
      this.createMeshProviderClient,
      this.createMeshSlasherClient,
      this.createMetaStakingClient,
    ].map(async (func) => {
      return await func(this)
    })

    const completed = await Promise.all(initClients)

    return completed
  }

  public get cosmWasmClient(): CosmWasmClient {
    return this._cosmWasmClient as CosmWasmClient
  }

  public get meshConsumerClient(): MeshConsumerQueryClient {
    return this._meshConsumerClient as MeshConsumerQueryClient
  }
  public get meshLockupClient(): MeshLockupQueryClient {
    return (
      this.signingMeshLockupClient ||
      (this._meshLockupClient as MeshLockupQueryClient)
    )
  }
  public get meshProviderClient(): MeshProviderQueryClient {
    return (
      this.signingMeshProviderClient ||
      (this._meshProviderClient as MeshProviderQueryClient)
    )
  }
  public get meshSlasherClient(): MeshSlasherQueryClient {
    return (
      this.signingMeshSlasherClient ||
      (this._meshSlasherClient as MeshSlasherQueryClient)
    )
  }
  public get metaStakingClient(): MetaStakingQueryClient {
    return (
      this.signingMetaStakingClient ||
      (this._metaStakingClient as MetaStakingClient)
    )
  }

  public get wallet(): WalletData {
    return this._wallet as WalletData
  }

  public async connectSigning() {
    try {
      if (!this.cosmWasmClient) {
        throw new Error('cosmWasmClient could not connect')
      }

      if (!this.signingCosmWasmClient) {
        throw new Error('signingCosmWasmClient could not connect')
      }

      // Create all contract clients
      await this.createContractClients()

      return this._wallet
    } catch (e) {
      console.error(e)
    }
  }

  public async disconnectSigning() {
    this.signingCosmWasmClient?.disconnect()
    this._wallet = null
  }

  private async createMeshConsumerClient(client: MeshClient) {
    if (!client.cosmWasmClient) return null

    client._meshConsumerClient = new MeshConsumerQueryClient(
      client.cosmWasmClient,
      junoContracts.meshConsumerAddr,
    )

    return client._meshConsumerClient
  }

  private async createMeshLockupClient(client: MeshClient) {
    if (client._wallet?.address && client.signingCosmWasmClient) {
      client.signingMeshLockupClient = new MeshLockupClient(
        client.signingCosmWasmClient,
        client._wallet.address,
        osmoContracts.meshLockupAddr,
      )
    } else if (client.cosmWasmClient) {
      client._meshLockupClient = new MeshLockupQueryClient(
        client.cosmWasmClient,
        osmoContracts.meshLockupAddr,
      )
    }

    return client.signingMeshLockupClient ?? client._meshLockupClient
  }

  private async createMeshProviderClient(client: MeshClient) {
    if (client._wallet?.address && client.signingCosmWasmClient) {
      client.signingMeshProviderClient = new MeshProviderClient(
        client.signingCosmWasmClient,
        client._wallet.address,
        osmoContracts.meshProviderAddr,
      )
    } else if (client.cosmWasmClient) {
      client._meshProviderClient = new MeshProviderQueryClient(
        client.cosmWasmClient,
        osmoContracts.meshProviderAddr,
      )
    }

    return client.signingMeshProviderClient ?? client._meshProviderClient
  }

  private async createMeshSlasherClient(client: MeshClient) {
    if (client._wallet?.address && client.signingCosmWasmClient) {
      client.signingMeshSlasherClient = new MeshSlasherClient(
        client.signingCosmWasmClient,
        client._wallet.address,
        osmoContracts.meshSlasherAddr,
      )
    } else if (client.cosmWasmClient) {
      client._meshSlasherClient = new MeshSlasherQueryClient(
        client.cosmWasmClient,
        osmoContracts.meshSlasherAddr,
      )
    }

    return client.signingMeshSlasherClient ?? client._meshSlasherClient
  }

  private async createMetaStakingClient(client: MeshClient) {
    if (client._wallet?.address && client.signingCosmWasmClient) {
      client.signingMetaStakingClient = new MetaStakingClient(
        client.signingCosmWasmClient,
        client._wallet.address,
        junoContracts.metaStakingAddr,
      )
    } else if (client.cosmWasmClient) {
      client._metaStakingClient = new MetaStakingQueryClient(
        client.cosmWasmClient,
        junoContracts.metaStakingAddr,
      )
    }

    return client.signingMetaStakingClient ?? client._metaStakingClient
  }
}
