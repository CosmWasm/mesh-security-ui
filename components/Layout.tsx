import { useMeshClient } from 'client'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ReactNode } from 'react'
import Footer from './Footer'
import { Navbar } from './Navbar'

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const { navigation } = useMeshClient()

  const defaultChain = 'osmosistestnet'

  return (
    <div className="min-h-screen text-black dark:text-white">
      <Navbar navigation={navigation} defaultChain={defaultChain} />
      <div className="lg:min-h-[92vh] pt-8 sm:pt-24">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
