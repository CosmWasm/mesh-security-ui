import React, { useEffect, useState, useMemo } from 'react'
import { useWallet } from '@cosmos-kit/react'
import { chains } from 'chain-registry'
import { WalletStatus } from '@cosmos-kit/core'
import WalletButton from '../components/Wallet'
import Head from 'next/head'
import { humanizeAmount } from 'util/denom'
import { BalanceResponse } from '../codegen/MeshLockup.types'
import { ValidatorResponse } from '../codegen/MeshProvider.types'
import Validator from '../components/Validator'
import { useMeshClient } from 'client'
import { useTx } from 'contexts/tx'
import {
  BanknotesIcon,
  LockClosedIcon,
  LockOpenIcon,
} from '@heroicons/react/24/outline'
import Spinner from 'components/Spinner'
import { Modal } from 'components/Modal'
import Input from 'components/Input'
import { useCallback } from 'react'
import { truncate } from 'util/addr'
import Button from 'components/Button'
import {
  generateBondMsg,
  generateStakeMsg,
  generateUnstakeMsg,
} from 'client/core/execute/delegation'

export default function Home() {
  const { client } = useMeshClient()
  const { tx } = useTx()

  const { address, currentWallet, walletStatus, currentChainName } = useWallet()

  const [selectedValidator, setSelectedValidator] = useState<
    ValidatorResponse
  >()

  const [showBondModal, setShowBondModal] = useState<boolean>(false)
  const handleBondModal = useCallback(() => {
    setBondError(undefined)
    setBondAmount(undefined)
    setShowBondModal(!showBondModal)
  }, [showBondModal])

  const [showDelegateModal, setShowDelegateModal] = useState<boolean>(false)
  const handleDelegateModal = useCallback(() => {
    setDelegateError(undefined)
    setDelegateAmount(undefined)
    setShowDelegateModal(!showDelegateModal)
  }, [showDelegateModal])

  const [showUndelegateModal, setShowUndelegateModal] = useState<boolean>(false)
  const handleUndelegateModal = useCallback(() => {
    setUndelegateError(undefined)
    setUndelegateError(undefined)
    setShowUndelegateModal(!showUndelegateModal)
  }, [showUndelegateModal])

  const chain = useMemo(
    () => chains.find((c) => c.chain_name === currentChainName),
    [currentChainName],
  )

  const [bonded, setBonded] = useState<BalanceResponse | null>(null)
  useEffect(() => {
    if (client?.signingCosmWasmClient && address) {
      updateBond(address)
    }
  }, [client?.signingCosmWasmClient, address])

  const updateBond = async (address: string) => {
    try {
      await client?.connectSigning('osmosistestnet')
      setBonded(null)
      const bonded = await client?.meshLockupClient.balance({
        account: address,
      })!
      setBonded(bonded)
    } catch (e) {
      setBonded({
        bonded: '0',
        free: '0',
        claims: [],
      })
    }
  }

  const [validators, setValidators] = useState<ValidatorResponse[]>([])
  useEffect(() => {
    if (client?.meshProviderClient && address) {
      const updateValidators = async () => {
        const { validators } = await client?.meshProviderClient.listValidators(
          {},
        )
        setValidators(validators)
      }
      updateValidators()
    }
  }, [client?.meshProviderClient, address])

  const [bondAmount, setBondAmount] = useState<number>()
  const [bondError, setBondError] = useState<string>()

  const [delegateAmount, setDelegateAmount] = useState<number>()
  const [delegateError, setDelegateError] = useState<string>()

  const [undelegateAmount, setUndelegateAmount] = useState<number>()
  const [undelegateError, setUndelegateError] = useState<string>()

  const handleBond = useCallback(() => {
    if (
      !bondAmount ||
      !currentWallet?.address ||
      !client?.signingMeshLockupClient
    )
      return

    if (bondError) return

    const msg = generateBondMsg(bondAmount * 1_000_000, 'uosmo', {
      sender: currentWallet?.address,
      meshLockupClient: client?.signingMeshLockupClient,
    })

    tx(
      [msg],
      {
        toast: {
          title: 'Bond successful',
        },
      },
      () => {
        updateBond(currentWallet?.address)
      },
    )
  }, [
    bondError,
    bondAmount,
    currentWallet?.address,
    client?.signingMeshLockupClient,
  ])

  const handleDelegate = useCallback(() => {
    if (
      !delegateAmount ||
      !selectedValidator ||
      !currentWallet?.address ||
      !client?.signingMeshLockupClient
    )
      return

    if (delegateError) return

    const msg = generateStakeMsg(
      delegateAmount * 1_000_000,
      selectedValidator.address,
      {
        sender: currentWallet.address,
        meshLockupClient: client?.signingMeshLockupClient,
      },
    )

    tx(
      [msg],
      {
        toast: {
          title: 'Delegate successful',
        },
      },
      () => {
        updateBond(currentWallet?.address)
      },
    )
  }, [
    delegateError,
    delegateAmount,
    selectedValidator,
    currentWallet?.address,
    client?.signingMeshLockupClient,
  ])

  const handleUndelegate = useCallback(() => {
    if (
      !undelegateAmount ||
      !selectedValidator ||
      !currentWallet?.address ||
      !client?.signingMeshProviderClient
    )
      return

    if (undelegateError) return

    const msg = generateUnstakeMsg(
      undelegateAmount * 1_000_000,
      selectedValidator.address,
      {
        sender: currentWallet.address,
        meshProviderClient: client?.signingMeshProviderClient,
      },
    )

    tx(
      [msg],
      {
        toast: {
          title: 'Delegate successful',
        },
      },
      () => {
        updateBond(currentWallet?.address)
      },
    )
  }, [
    undelegateError,
    undelegateAmount,
    selectedValidator,
    currentWallet?.address,
    client?.signingMeshProviderClient,
  ])

  return (
    <div className="max-w-5xl py-10 mx-auto">
      <Head>
        <title>Osmosis Provider | Mesh Security</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Bond modal */}
      <Modal
        open={showBondModal}
        handleStateChange={handleBondModal}
        actions={[
          { name: 'Bond', button: 'primary', action: handleBond },
          { name: 'Cancel', button: 'secondary' },
        ]}
      >
        <h3 className="-mt-1 text-lg font-semibold text-white">Bond OSMO</h3>
        <div className="mt-2">
          <Input
            id="bond-amount"
            type="number"
            label="Amount to bond"
            trailingAddon="OSMO"
            value={bondAmount}
            error={bondError}
            onChange={(e) => {
              try {
                const val = parseInt(e.currentTarget.value)
                if (client?.wallet.balance)
                  if (
                    val * 1_000_000 >
                    parseInt(client.wallet.balance?.amount)
                  ) {
                    return setBondError('You do not have enough OSMO')
                  }
                setBondAmount(val)
              } catch {
                setBondError('Value must be a number')
              }
            }}
          />
        </div>
      </Modal>

      {/* Delegate modal */}
      <Modal
        open={showDelegateModal}
        handleStateChange={handleDelegateModal}
        actions={[
          { name: 'Delegate', button: 'primary', action: handleDelegate },
          { name: 'Cancel', button: 'secondary' },
        ]}
      >
        <h3 className="-mt-1 text-lg font-semibold text-white">
          Delegate to {truncate(selectedValidator?.address || '')}
        </h3>
        <div className="mt-2">
          <Input
            id="delegate-amount"
            type="number"
            label="Amount to delegate"
            trailingAddon="OSMO"
            value={delegateAmount}
            error={delegateError}
            onChange={(e) => {
              try {
                const val = parseInt(e.currentTarget.value)
                if (bonded)
                  if (val * 1_000_000 > parseInt(bonded.free)) {
                    return setBondError('You do not have enough OSMO')
                  }
                setDelegateAmount(val)
              } catch {
                setBondError('Value must be a number')
              }
            }}
          />
        </div>
      </Modal>

      {/* Undelegate modal */}
      <Modal
        open={showUndelegateModal}
        handleStateChange={handleUndelegateModal}
        actions={[
          { name: 'Undelegate', button: 'primary', action: handleUndelegate },
          { name: 'Cancel', button: 'secondary' },
        ]}
      >
        <h3 className="-mt-1 text-lg font-semibold text-white">
          Undelegate from {truncate(selectedValidator?.address || '')}
        </h3>
        <div className="mt-2">
          <Input
            id="undelgeate-amount"
            type="number"
            label="Amount to undelegate"
            trailingAddon="OSMO"
            value={delegateAmount}
            error={delegateError}
            onChange={(e) => {
              try {
                const val = parseInt(e.currentTarget.value)
                setUndelegateAmount(val)
              } catch {
                setBondError('Value must be a number')
              }
            }}
          />
        </div>
      </Modal>
      <div className="pb-4 text-center">
        <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl">
          Osmosis Provider
        </h1>
      </div>

      {walletStatus !== WalletStatus.Connected && (
        <div className="max-w-[14rem] mx-auto">
          <WalletButton chainName={currentChainName} />
        </div>
      )}

      {walletStatus === WalletStatus.Connected && (
        <div className="lg:max-w-[28rem] lg:mx-auto mx-8">
          <div className="grid grid-cols-1 gap-2 p-2 border rounded-lg lg:gap-0 lg:grid-cols-3 border-black/10 dark:border-white/10">
            <div className="flex flex-row items-center justify-center space-x-2">
              <BanknotesIcon className="w-5 h-5 text-black dark:text-white" />
              <p className="flex flex-row items-center font-medium uppercase">
                {client?.wallet?.balance ? (
                  humanizeAmount(client?.wallet?.balance?.amount!)
                ) : (
                  <Spinner className="w-4 h-4" />
                )}{' '}
                {chain?.bech32_prefix}
              </p>
            </div>
            <div className="flex flex-row items-center justify-center space-x-2">
              <LockOpenIcon className="w-5 h-5 text-black dark:text-white" />
              <p className="flex flex-row items-center font-medium uppercase">
                {bonded ? (
                  humanizeAmount(bonded.free)
                ) : (
                  <Spinner className="w-4 h-4" />
                )}{' '}
                {chain?.bech32_prefix}
              </p>
            </div>

            <div className="flex flex-row items-center justify-center space-x-2">
              <LockClosedIcon className="w-5 h-5 text-black dark:text-white" />
              <p className="flex flex-row items-center font-medium uppercase">
                {bonded ? (
                  humanizeAmount(
                    parseInt(bonded.bonded) - parseInt(bonded.free),
                  )
                ) : (
                  <Spinner className="w-4 h-4" />
                )}{' '}
                {chain?.bech32_prefix}
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              handleBondModal()
            }}
            className="inline-flex items-center justify-center w-full mt-2"
          >
            <LockClosedIcon className="w-5 h-5 mr-2 text-white" />
            Bond OSMO
          </Button>
        </div>
      )}

      <div>
        <div className="flex flex-col mt-4 space-y-2">
          {validators.map((validator, key) => (
            <Validator
              key={key}
              address={validator.address}
              actions={[
                {
                  name: 'Delegate',
                  onClick: () => {
                    setSelectedValidator(validator)
                    handleDelegateModal()
                  },
                },
                {
                  name: 'Undelegate',
                  onClick: () => {
                    setSelectedValidator(validator)
                    handleUndelegateModal()
                  },
                },
              ]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
