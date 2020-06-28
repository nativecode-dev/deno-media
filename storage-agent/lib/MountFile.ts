import { StorageAgentMount } from './StorageAgentOptions.ts'

export interface MountFile {
  checksum?: string
  guessit?: any
  queued: string[]
  mount: StorageAgentMount
  name: string
  path: string
  type: 'directory' | 'file'
}
