import { Documents } from '../deps.ts'

export interface StorageAgentTask {
  file(file: Documents.MountFileInstance[]): Promise<Documents.MountFileInstance[]>
}

export const StorageAgentTaskToken: symbol = Symbol('StorageAgentTask')
