import { Alo, CinemonClient, Dent } from '../deps.ts'

import { StorageAgent } from './StorageAgent.ts'

import { StorageManager } from './StorageManager.ts'
import { UpdateGuessit } from './Tasks/UpdateGuessit.ts'

import { StorageAgentTask } from './StorageAgentTask.ts'
import { StorageAgentTaskToken } from './StorageAgentTask.ts'
import { StorageAgentOptions, StorageAgentOptionsToken } from './StorageAgentOptions.ts'

export async function main(options: StorageAgentOptions): Promise<void> {
  const logger = Dent.createLogger([Dent.SysInfo.hostname(), options.type].join(':'))
  logger.intercept(Dent.createScrubTransformer(['apikey', 'api_key', 'password']))
  Dent.LincolnLogDebug.observe(logger)

  logger.debug('[configuration]', options)

  Alo.container.register<CinemonClient>(CinemonClient, { useFactory: () => new CinemonClient({ connection: options.cinemon }) })
  Alo.container.register<Dent.Lincoln>(Dent.LoggerType, { useValue: logger })
  Alo.container.register<StorageAgent>(StorageAgent, { useClass: StorageAgent })
  Alo.container.register<StorageAgentOptions>(StorageAgentOptionsToken, { useValue: options })
  Alo.container.register<StorageAgentTask>(StorageAgentTaskToken, { useClass: UpdateGuessit })
  Alo.container.register<StorageManager>(StorageManager, { useClass: StorageManager })

  const scheduler = new Dent.Scheduler()
  Alo.container.register<Dent.Scheduler>(Dent.Scheduler, { useValue: scheduler })

  const server = Alo.container.resolve(StorageAgent)
  logger.debug('[storage-agent] resolved')
  return server.start()
}
