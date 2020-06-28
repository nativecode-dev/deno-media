import { MountFile } from './MountFile.ts'

export interface StorageAgentTask {
  file(file: MountFile): Promise<MountFile>
}

export const StorageAgentTaskToken: symbol = Symbol('StorageAgentTask')
