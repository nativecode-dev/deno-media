import { Dent, Documents, Alo } from '../deps.ts'

import { MediaStore, MediaStoreServer, MediaStoreOptions, MediaStoreOptionsToken } from '../mod.ts'

export async function main(options: MediaStoreOptions): Promise<void> {
  const logger = Dent.createLogger('media-store')
  logger.intercept(Dent.createScrubTransformer(['apikey', 'api_key', 'password']))
  Dent.LincolnLogDebug.observe(logger)

  logger.debug('[storage] register')
  logger.debug('[configuration]', options)

  const store = new MediaStore(options)

  if ((await store.couchdb.exists(options.database.name)) === false) {
    await store.couchdb.create(options.database.name)
  }

  Alo.container.register<Dent.PublisherFactory>(Dent.PublisherFactory, {
    useFactory: () => new Dent.PublisherFactory(options.connections.queue),
  })

  Alo.container.register(MediaStore, { useValue: store })
  Alo.container.register(MediaStoreServer, MediaStoreServer)

  Alo.container.registerInstance<MediaStoreOptions>(MediaStoreOptionsToken, options)
  Alo.container.registerInstance<Dent.Lincoln>(Dent.LoggerType, logger)

  Alo.container.registerSingleton(Dent.Scheduler, Dent.Scheduler)

  Alo.container.register<Documents.DataContext>(Documents.DataContext, {
    useValue: new Documents.DataContext(options.database.name, store.couchdb),
  })

  const server = Alo.container.resolve(MediaStoreServer)
  logger.debug('[media-store-server] resolved')
  return server.run()
}
