import { Mount } from './Mount.ts'

export interface MountFileInstance {
  data: any
  name: string
  path: string
}

export interface MountFile {
  checksum: string
  files: MountFileInstance[]
  mount: Mount
  type: 'directory' | 'file'
}
