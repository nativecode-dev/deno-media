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
  queue: Dent.ConnectorOptions
  hostname: string
  schedules: { [key: string]: string }
  type: string
}

export const DefaultStorageAgentOptions: StorageAgentOptions = {
  cinemon: {
    endpoint: {
      host: 'localhost',
      protocol: 'http',
    },
    name: 'cinemon',
  },
  couchdb: {
    endpoint: {
      host: 'localhost',
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
  queue: {
    credentials: {
      password: 'guest',
      username: 'guest',
    },
    endpoint: {
      host: 'localhost',
      path: '/',
      port: 5672,
    },
    name: 'queue',
  },
  hostname: Dent.SysInfo.hostname(),
  schedules: {
    heartbeat: '1m',
    scan: '1m',
  },
  type: 'storage-agent',
}

export const StorageAgentOptionsToken: symbol = Symbol('StorageAgentOptions')
