import { Dent, Alo } from '../deps.ts'

import {
  MediaStore,
  MediaStoreMessage,
  MediaStoreMessageToken,
  MediaStoreServer,
  MediaStoreOptions,
  MediaStoreOptionsToken,
} from '../mod.ts'

export function main(options: MediaStoreOptions): Promise<void> {
  console.log('[media-store-server] register')
  const queue: Dent.QueueOptions = { subject: 'media-store' }
  const factory = new Dent.PublisherFactory<MediaStoreMessage>(options.connections.queue, queue)

  Alo.container.registerInstance(MediaStoreOptionsToken, options)

  Alo.container.register(MediaStore, { useValue: new MediaStore(options) })
  Alo.container.register(MediaStoreServer, MediaStoreServer)
  Alo.container.register<Dent.PublisherFactory<MediaStoreMessage>>(MediaStoreMessageToken, { useValue: factory })

  const server = Alo.container.resolve(MediaStoreServer)
  console.log('[media-store-server] resolved')
  return server.run()
}
