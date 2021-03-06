import { Dent, Documents, Alo } from '../deps.ts'

import { MediaStore } from './MediaStore.ts'
import { Cinemon } from './Cinemon.ts'
import { LogMiddleware } from './Middlewares/LogMiddleware.ts'
import { CinemonOptions, CinemonOptionsToken } from './CinemonOptions.ts'

export async function main(options: CinemonOptions): Promise<void> {
  const logger = Dent.createLogger([Dent.SysInfo.hostname(), 'cinemon'].join(':'))
  logger.intercept(Dent.createScrubTransformer(['apikey', 'api_key', 'password']))
  Dent.LincolnLogDebug.observe(logger)

  logger.debug('[cinemon] register')
  logger.debug('[configuration]', options)

  const store = new MediaStore(options)

  if ((await store.couchdb.exists(options.database.name)) === false) {
    await store.couchdb.create(options.database.name)
  }

  Alo.container.register<Dent.PublisherFactory>(Dent.PublisherFactory, {
    useFactory: () => new Dent.PublisherFactory(options.connections.queue),
  })

  Alo.container.register<MediaStore>(MediaStore, { useValue: store })
  Alo.container.register<Cinemon>(Cinemon, Cinemon)
  Alo.container.register<LogMiddleware>(LogMiddleware, LogMiddleware)

  Alo.container.registerInstance<CinemonOptions>(CinemonOptionsToken, options)
  Alo.container.registerInstance<Dent.Lincoln>(Dent.LoggerType, logger)

  Alo.container.registerSingleton(Dent.Scheduler, Dent.Scheduler)

  Alo.container.register<Documents.DataContext>(Documents.DataContext, {
    useValue: new Documents.DataContext(options.database.name, store.couchdb),
  })

  const server = Alo.container.resolve(Cinemon)
  logger.debug('[cinemon-server] resolved')
  return server.run()
}
