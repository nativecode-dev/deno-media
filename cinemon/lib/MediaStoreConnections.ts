import { Dent } from '../deps.ts'

export interface MediaStoreConnections {
  [key: string]: Dent.ConnectorOptions
  couchdb: Dent.ConnectorOptions
  queue: Dent.ConnectorOptions
  radarr: Dent.ConnectorOptions
  sonarr: Dent.ConnectorOptions
  tmdb: Dent.ConnectorOptions
}

export const DefaultMediaStoreConnections: MediaStoreConnections = Dent.ObjectMerge.merge<MediaStoreConnections>(
  {
    couchdb: {
      endpoint: {
        host: 'localhost',
        port: 5984,
        protocol: 'http'
      },
      name: 'couchdb',
    },
    queue: {
      credentials: {
        password: 'guest',
        username: 'guest',
      },
      endpoint: {
        host: 'localhost',
        port: 6379,
        protocol: 'http',
      },
      name: 'queue',
    },
    radarr: {
      credentials: {
        password: 'apikey',
      },
      endpoint: {
        host: 'localhost',
        path: 'api',
        port: 7878,
        protocol: 'http',
      },
      name: 'radarr',
    },
    tmdb: {
      endpoint: {
        host: 'api.themoviedb.org',
        path: '3',
        protocol: 'https',
      },
      name: 'tmdb',
    },
    sonarr: {
      credentials: {
        password: 'apikey',
      },
      endpoint: {
        host: 'localhost',
        path: 'api',
        port: 8989,
        protocol: 'http',
      },
      name: 'sonarr',
    },
  },
  new Dent.Env({ env: Deno.env.toObject(), prefix: ['media_store'] }).toObject().media_store,
)
