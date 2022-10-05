import React from 'react'
import { MeshClient } from 'client/core'

const MeshClientContext = React.createContext<{
  client: MeshClient | null
  connectSigning: () => void
}>({
  client: null,
  connectSigning: () => {},
})
export default MeshClientContext
