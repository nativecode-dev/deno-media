import { StorageAgentMount } from './StorageAgentOptions.ts'

export interface MountFile {
  checksum?: string
  mount: StorageAgentMount
  name: string
  path: string
  type: 'directory' | 'file'
}
