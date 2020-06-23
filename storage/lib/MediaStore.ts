import { Connectors, Alo, Dent } from '../deps.ts'

import { MediaStoreOptions, MediaStoreOptionsToken } from './MediaStoreOptions.ts'

export interface MediaStoreMessage {}

export const MediaStoreMessageToken: symbol = Symbol('MediaStoreMessage')

@Alo.Injectable()
export class MediaStore {
  readonly couchdb: Connectors.Couch.CouchStore
  readonly radarr: Connectors.Radarr.RadarrClient
  readonly tmdb: Connectors.TMDB.TmdbClient
  readonly sonarr: Connectors.Sonarr.SonarrClient

  constructor(@Alo.Inject(MediaStoreOptionsToken) options: MediaStoreOptions) {
    this.couchdb = new Connectors.Couch.CouchStore(options.connections.couchdb)
    this.tmdb = new Connectors.TMDB.TmdbClient(options.connections.tmdb)

    this.radarr = Connectors.Radarr.RadarrConnector(options.connections.radarr)
    this.sonarr = Connectors.Sonarr.SonarrConnector(options.connections.sonarr)
  }
}
