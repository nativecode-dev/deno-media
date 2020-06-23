import { Connectors, Alo, Dent } from '../deps.ts'

import { MediaStoreOptions, MediaStoreOptionsToken } from './MediaStoreOptions.ts'

export interface MediaStoreMessage {}

export const MediaStoreMessageToken: symbol = Symbol('MediaStoreMessage')

@Alo.Injectable()
export class MediaStore {
  readonly couchdb: Connectors.Couch.CouchStore
  readonly publish: Dent.IPublisher<MediaStoreMessage>
  readonly tmdb: Connectors.TMDB.TmdbClient

  constructor(
    @Alo.Inject(MediaStoreOptionsToken) options: MediaStoreOptions,
    @Alo.Inject(MediaStoreMessageToken) queue: Dent.IPublisher<MediaStoreMessage>,
  ) {
    this.couchdb = new Connectors.Couch.CouchStore(options.connections.couchdb)
    this.publish = queue
    this.tmdb = new Connectors.TMDB.TmdbClient(options.connections.tmdb)
  }
}
