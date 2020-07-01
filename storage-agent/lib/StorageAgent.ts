import { Alo, BError, CinemonClient, Dent } from '../deps.ts'

import { StorageManager } from './StorageManager.ts'
import { StorageAgentTask } from './StorageAgentTask.ts'
import { StorageAgentTaskToken } from './StorageAgentTask.ts'
import { StorageAgentOptions, StorageAgentOptionsToken } from './StorageAgentOptions.ts'

@Alo.Injectable()
export class StorageAgent {
  private readonly log: Dent.Lincoln

  constructor(
    @Alo.Inject(Dent.LoggerType) logger: Dent.Lincoln,
    @Alo.Inject(Dent.Scheduler) private readonly scheduler: Dent.Scheduler,
    @Alo.Inject(StorageAgentOptionsToken) private readonly options: StorageAgentOptions,
    @Alo.Inject(StorageManager) private readonly storage: StorageManager,
    @Alo.Inject(CinemonClient) private readonly cinemon: CinemonClient,
    @Alo.InjectAll(StorageAgentTaskToken) private readonly tasks: StorageAgentTask[],
  ) {
    this.log = logger.extend('server')
  }

  async start() {
    this.scheduler.fromSchedule({
      command: () => this.checkin(this.log.extend('heartbeat')),
      name: 'heartbeat',
      schedule: this.options.schedules.heartbeat,
      type: Dent.ScheduleType.every,
    })

    this.scheduler.fromSchedule({
      command: () => this.scan(this.log.extend('scan')),
      name: 'scan',
      schedule: this.options.schedules.scan,
      type: Dent.ScheduleType.every,
    })
  }

  private async checkin(log: Dent.Lincoln) {
    log.debug('[checkin-start]')

    try {
      const hostname = Dent.SysInfo.hostname(true)
      const ipaddress = (await Dent.SysInfo.ip_private()) || (await Dent.SysInfo.ip_public())
      await this.cinemon.nodes.checkin(this.options.type, hostname, ipaddress)
    } catch (error) {
      log.error(error)
    }

    log.debug('[checkin-done]')
  }

  private async scan(log: Dent.Lincoln) {
    log.debug('[scan-start]')

    const tasks = Object.keys(this.options.mounts)
      .filter((name) => this.options.mounts[name].enabled)
      .map((name) => async () => {
        log.debug('[scan-mount-start]', { mount: name })

        const mount = this.options.mounts[name]

        for await (const mountfile of this.storage.files(mount)) {
          const transformed = await this.tasks.reduce(
            (previous, task) =>
              previous.then(async (file) => {
                mountfile.files = await task.file(file.files)
                return mountfile
              }),
            Promise.resolve(mountfile),
          )

          try {
            await this.cinemon.files.update(transformed)
          } catch (error) {
            log.error(error)
          }
        }

        log.debug('[scan-mount-done]', { mount: name })
      })

    try {
      await Dent.Throttle.all(tasks)
    } catch (error) {
      log.error(new BError('scan-error', error))
    }

    log.debug('[scan-done]')
  }
}
