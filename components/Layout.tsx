import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ReactNode } from 'react'
import { Navbar } from './Navbar'

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const defaultChain = 'osmosistestnet'

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

  return (
    <div className="min-h-screen text-black dark:text-white">
      <Navbar navigation={navigation} defaultChain={defaultChain} />
      <div className="lg:min-h-[90vh] pt-8 sm:pt-24">{children}</div>
    </div>
  )
}

export default Layout
