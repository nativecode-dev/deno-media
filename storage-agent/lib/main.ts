import { Alo, Connectors, Dent } from '../deps.ts'

import { StorageAgent } from './StorageAgent.ts'

import { StorageManager } from './StorageManager.ts'
import { UpdateChecksum } from './Tasks/UpdateChecksum.ts'
import { StorageAgentTask } from './StorageAgentTask.ts'
import { StorageAgentTaskToken } from './StorageAgentTask.ts'
import { StorageAgentContext } from './StorageAgentContext.ts'
import { DocumentStoreToken, DatabaseNameToken } from './Tokens.ts'
import { StorageAgentOptions, StorageAgentOptionsToken } from './StorageAgentOptions.ts'

export async function main(options: StorageAgentOptions): Promise<void> {
  const logger = Dent.createLogger('media-agent')
  logger.intercept(Dent.createScrubTransformer(['apikey', 'api_key', 'password']))
  Dent.LincolnLogDebug.observe(logger)

  logger.debug('[storage-agent]', 'register')
  logger.debug('[configuration]', options)

  const store = new Connectors.Couch.CouchStore(options.couchdb)

  const hostname = (Deno.env.get('HOST') || Deno.hostname()).replace(/\./g, '-')
  const dbname = `agent-${hostname}`

  if ((await store.exists(dbname)) === false) {
    await store.create(dbname)
  }

  Alo.container.register<string>(DatabaseNameToken, { useValue: dbname })
  Alo.container.register<Dent.DocumentStore>(DocumentStoreToken, { useValue: store })
  Alo.container.register<Dent.Lincoln>(Dent.LoggerType, { useValue: logger })

  Alo.container.register<StorageAgent>(StorageAgent, { useClass: StorageAgent })
  Alo.container.register<StorageAgentContext>(StorageAgentContext, { useClass: StorageAgentContext })
  Alo.container.register<StorageAgentOptions>(StorageAgentOptionsToken, { useValue: options })
  Alo.container.register<StorageAgentTask>(StorageAgentTaskToken, { useClass: UpdateChecksum })
  Alo.container.register<StorageManager>(StorageManager, { useClass: StorageManager })

  const scheduler = new Dent.Scheduler()
  Alo.container.register<Dent.Scheduler>(Dent.Scheduler, { useValue: scheduler })

  const server = Alo.container.resolve(StorageAgent)
  logger.debug('[storage-agent] resolved')
  return server.start()
}