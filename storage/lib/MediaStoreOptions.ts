import { Dent } from '../deps.ts'

import { MediaStoreConnections, DefaultMediaStoreConnections } from './MediaStoreConnections.ts'

export interface MediaStoreOptions {
  connections: MediaStoreConnections
  hosting: Dent.ConnectorOptions
}

export const DefaultMediaStoreOptions: MediaStoreOptions = {
  connections: DefaultMediaStoreConnections,
  hosting: {
    endpoint: {
      host: 'localhost',
      port: 3000,
    },
    name: 'media-store',
  },
}

export const MediaStoreOptionsToken: symbol = Symbol('MediaStoreOptions')
