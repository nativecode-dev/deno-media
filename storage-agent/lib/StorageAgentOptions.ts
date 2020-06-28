import { Dent } from '../deps.ts'

export interface StorageAgentMount {
  allowed: string[]
  enabled: boolean
  name: string
  ignore: string[]
  path: string
  recurse: boolean
}

export interface StorageAgentOptions {
  cinemon: Dent.ConnectorOptions
  couchdb: Dent.ConnectorOptions
  mounts: { [key: string]: StorageAgentMount }
}

export const DefaultStorageAgentOptions: StorageAgentOptions = {
  cinemon: {
    endpoint: {
      host: 'localhost',
      port: 80,
      protocol: 'http',
    },
    name: 'cinemon',
  },
  couchdb: {
    endpoint: {
      host: 'localhost',
      port: 80,
      protocol: 'http',
    },
    name: 'cinemon',
  },
  mounts: {
    cwd: {
      allowed: [],
      enabled: false,
      ignore: ['.git', 'node_modules'],
      name: 'cwd',
      path: Deno.cwd(),
      recurse: true,
    },
  },
}

export const StorageAgentOptionsToken: symbol = Symbol('StorageAgentOptions')
