import { useState, useEffect, useMemo } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames } from 'util/css'
import { WalletButton } from './Wallet'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface NavigationItem {
  name: string
  href: string
  current: boolean
  chain: string
}

export interface NavbarProps {
  navigation: NavigationItem[]
  defaultChain: string
}

export const Navbar = ({ navigation, defaultChain }: NavbarProps) => {
  const [scrollY, setScrollY] = useState<number>(0)

  const router = useRouter()

  const chainName = useMemo(
    () => navigation.find((n) => n.current)?.chain ?? defaultChain,
    [router.asPath],
  )

  useEffect(() => {
    const onScroll = (e: any) => setScrollY(e.target.documentElement.scrollTop)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollY])

  return (
    <Disclosure
      as="nav"
      className={classNames(
        scrollY > 0 ? 'bg-opacity-75 [backdrop-filter:blur(10px)]' : '',
        'top-0 z-10 w-screen border-b sm:fixed sm:h-16 border-black/10 dark:border-white/10',
      )}
    >
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex justify-center h-16 sm:justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-black/50 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-black/75 dark:hover:text-white/75 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0 sm:pr-6">
                  <Link href="/">
                    <a className="text-xl font-extrabold">Mesh Security</a>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item, key) => (
                    <Link href={item.href} key={key}>
                      <a
                        className={classNames(
                          item.current
                            ? 'border-primary text-primary'
                            : 'border-transparent hover:border-white/10',
                          'inline-flex items-center px-1 pt-1 text-sm text-white border-b-2',
                        )}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 items-center hidden pr-2 sm:flex sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <WalletButton chainName={chainName} />
              </div>
            </div>
            <div className="flex items-center pr-2 mb-2 sm:hidden sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <WalletButton chainName={chainName} />
            </div>
          </div>

          <Disclosure.Panel className="mt-4 border-t sm:hidden border-black/10 dark:border-white/10">
            <div className="pt-2 pb-4 space-y-1">
              {navigation.map((item, key) => (
                <Link href={item.href} key={key}>
                  <Disclosure.Button
                    as="a"
                    className={classNames(
                      item.current
                        ? 'border-primary bg-primary-300/10 text-primary'
                        : 'border-transparent hover:border-white/10',
                      'block items-center px-3 py-3 font-medium text-white border-l-4',
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar
