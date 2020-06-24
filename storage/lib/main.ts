import { Dent, Documents, Alo } from '../deps.ts'

import {
  MediaStore,
  MediaStoreMessage,
  MediaStoreMessageToken,
  MediaStoreServer,
  MediaStoreOptions,
  MediaStoreOptionsToken,
} from '../mod.ts'

export async function main(options: MediaStoreOptions): Promise<void> {
  console.log('[media-store-server] register')
  const queue: Dent.QueueOptions = { subject: options.database.name }
  const factory = new Dent.PublisherFactory<MediaStoreMessage>(options.connections.queue, queue)
  const store = new MediaStore(options)

  if ((await store.couchdb.exists(options.database.name)) === false) {
    await store.couchdb.create(options.database.name)
  }

  Alo.container.registerInstance(MediaStoreOptionsToken, options)
  Alo.container.register(MediaStore, { useValue: store })
  Alo.container.register(MediaStoreServer, MediaStoreServer)
  Alo.container.register<Dent.PublisherFactory<MediaStoreMessage>>(MediaStoreMessageToken, { useValue: factory })

  Alo.container.register<Documents.DataContext>(Documents.DataContext, {
    useValue: new Documents.DataContext(options.database.name, store.couchdb),
  })

  const server = Alo.container.resolve(MediaStoreServer)
  console.log('[media-store-server] resolved')
  return server.run()
}
