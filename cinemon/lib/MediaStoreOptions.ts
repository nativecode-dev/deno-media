import { Dent } from '../deps.ts'

import { MediaStoreConnections, DefaultMediaStoreConnections } from './MediaStoreConnections.ts'

export interface MediaStoreOptions {
  connections: MediaStoreConnections
  database: { name: string }
  hosting: Dent.ConnectorOptions
}

export const DefaultMediaStoreOptions: MediaStoreOptions = {
  connections: DefaultMediaStoreConnections,
  database: { name: 'media-store' },
  hosting: {
    endpoint: {
      host: Dent.SysInfo.hostname(),
      port: 3000,
    },
    name: 'media-store',
  },
}

export const MediaStoreOptionsToken: symbol = Symbol('MediaStoreOptions')
