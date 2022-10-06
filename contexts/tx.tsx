import { createContext, ReactNode, useContext } from 'react'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { isDeliverTxSuccess } from '@cosmjs/stargate'
import { coins } from '@cosmjs/stargate'
import useToaster, { ToastPayload, ToastTypes } from 'hooks/toast'
import { useMeshClient } from 'client'
import { useWallet } from '@cosmos-kit/react'

// Context to handle simple signingClient transactions
export interface Msg {
  typeUrl: string
  value: any
}

export interface TxOptions {
  gas?: number
  toast?: {
    title?: ToastPayload['title']
    message?: ToastPayload['message']
    type?: ToastTypes
    actions?: JSX.Element
  }
}

export interface TxContext {
  tx: (
    msgs: Msg[],
    options: TxOptions,
    callback?: (log: any) => void,
  ) => Promise<void>
}

export const Tx = createContext<TxContext>({
  tx: () => new Promise(() => {}),
})

export function TxProvider({ children }: { children: ReactNode }) {
  const { currentWallet } = useWallet()
  const { client } = useMeshClient()
  const signingCosmWasmClient = client?.signingCosmWasmClient

  const toaster = useToaster()

  // Method to sign & broadcast transaction
  const tx = async (
    msgs: Msg[],
    options: TxOptions,
    callback?: (log: any) => void,
  ) => {
    // Gas config
    const fee = {
      amount: coins(0, 'uosmo'),
      gas: options.gas ? String(options.gas) : '666666',
    }

    // Broadcast the redelegation message to Keplr
    let signed
    try {
      if (currentWallet?.address) {
        signed = await signingCosmWasmClient?.sign(
          currentWallet?.address,
          msgs,
          fee,
          '',
        )
      }
    } catch (e) {
      console.error(e)
      toaster.toast({
        title: 'Request Rejected',
        dismissable: true,
        type: ToastTypes.Error,
      })
      return
    }

    let broadcastToastId = ''

    broadcastToastId = toaster.toast(
      {
        title: 'Broadcasting transaction...',
        type: ToastTypes.Pending,
      },
      { duration: 999999 },
    )

    if (signingCosmWasmClient && signed) {
      await signingCosmWasmClient
        .broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()))
        .then((res) => {
          toaster.dismiss(broadcastToastId)
          if (isDeliverTxSuccess(res)) {
            // Get raw log
            let log = JSON.parse(res.rawLog as string)

            // Run callback
            if (callback) callback(log[0])

            toaster.toast({
              title: options.toast?.title || 'Transaction Successful',
              type: options.toast?.type || ToastTypes.Success,
              dismissable: true,
              actions: options.toast?.actions || <></>,
              message: options.toast?.message || <></>,
            })
          } else {
            toaster.toast({
              title: 'Error',
              message: res.rawLog,
              type: ToastTypes.Error,
            })
          }
        })
    } else {
      toaster.dismiss(broadcastToastId)
    }
  }

  return <Tx.Provider value={{ tx }}>{children}</Tx.Provider>
}

export const useTx = (): TxContext => useContext(Tx)
