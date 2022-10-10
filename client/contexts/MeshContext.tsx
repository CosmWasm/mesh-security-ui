import React from 'react'
import { MeshClient } from 'client/core'
import { NavigationItem } from 'components/Navbar'

const MeshClientContext = React.createContext<{
  client: MeshClient | null
  connectSigning: () => void
  navigation: NavigationItem[]
}>({
  client: null,
  connectSigning: () => {},
  navigation: [],
})
export default MeshClientContext
