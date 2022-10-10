import { useContext } from 'react'
import MeshContext from './MeshContext'

export default function useMeshClient() {
  const client = useContext(MeshContext)
  return client
}
