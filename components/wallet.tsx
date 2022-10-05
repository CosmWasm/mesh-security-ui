import { MouseEventHandler, useEffect, useMemo } from 'react'
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import { useWallet } from '@cosmos-kit/react'
import { ChainName, WalletStatus } from '@cosmos-kit/core'

const buttons = {
  Disconnected: {
    icon: WalletIcon,
    title: 'Connect Wallet',
  },
  Connected: {
    icon: WalletIcon,
    title: 'My Wallet',
  },
  Rejected: {
    icon: ArrowPathIcon,
    title: 'Reconnect',
  },
  Error: {
    icon: ArrowPathIcon,
    title: 'Change Wallet',
  },
  NotExist: {
    icon: ArrowDownTrayIcon,
    title: 'Install Wallet',
  },
}

export const WalletButton = ({
  chainName = process.env.NEXT_PUBLIC_CHAIN!,
}: {
  chainName?: ChainName
}) => {
  const walletManager = useWallet()
  const {
    connect,
    openView,
    setCurrentChain,
    walletStatus,
    currentWalletName,
  } = walletManager

  useEffect(() => {
    setCurrentChain(chainName)
  }, [chainName, setCurrentChain])

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault()
    openView()
    if (currentWalletName) {
      await connect()
    }
  }

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault()
    openView()
  }

  const _renderConnectButton = useMemo(() => {
    // Spinner
    if (walletStatus === WalletStatus.Connecting) {
      return (
        <button className="rounded-lg w-full bg-primary-500 hover:bg-primary-500/75 inline-flex justify-center items-center py-2.5 font-medium cursor-wait text-white">
          <svg
            className="w-5 h-5 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </button>
      )
    }

    let onClick
    if (
      walletStatus === WalletStatus.Disconnected ||
      walletStatus === WalletStatus.Rejected
    )
      onClick = onClickConnect
    else onClick = onClickOpenView

    const buttonData = buttons[walletStatus]

    return (
      <button
        className="rounded-lg bg-primary-500 px-6 w-full hover:bg-primary-600 inline-flex justify-center items-center py-1.5 font-medium text-white"
        onClick={onClick}
      >
        <buttonData.icon className="flex-shrink-0 w-5 h-5 mr-2 text-white" />
        {buttonData.title}
      </button>
    )
  }, [walletStatus])

  return _renderConnectButton
}

export default WalletButton
