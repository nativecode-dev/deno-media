import { Alo, BError, CinemonClient, Dent, Path } from '../deps.ts'

import { MountFile } from './MountFile.ts'
import { StorageManager } from './StorageManager.ts'
import { StorageAgentTask } from './StorageAgentTask.ts'
import { StorageAgentTaskToken } from './StorageAgentTask.ts'
import { StorageAgentContext } from './StorageAgentContext.ts'
import { StorageAgentOptions, StorageAgentOptionsToken } from './StorageAgentOptions.ts'

@Alo.Injectable()
export class StorageAgent {
  private readonly log: Dent.Lincoln

  constructor(
    @Alo.Inject(Dent.LoggerType) logger: Dent.Lincoln,
    @Alo.Inject(Dent.Scheduler) private readonly scheduler: Dent.Scheduler,
    @Alo.Inject(StorageAgentContext) private readonly context: StorageAgentContext,
    @Alo.Inject(StorageAgentOptionsToken) private readonly options: StorageAgentOptions,
    @Alo.Inject(StorageManager) private readonly storage: StorageManager,
    @Alo.Inject(CinemonClient) private readonly cinemon: CinemonClient,
    @Alo.InjectAll(StorageAgentTaskToken) private readonly tasks: StorageAgentTask[],
  ) {
    this.log = logger.extend('storage-agent')
  }

  async start() {
    this.scheduler.fromSchedule({ command: () => this.checkin(), name: 'heartbeat', schedule: '1m', type: Dent.ScheduleType.every })
    this.scheduler.fromSchedule({ command: () => this.scan(), name: 'scan', schedule: '10m', type: Dent.ScheduleType.every })
  }

  private async checkin() {
    this.log.debug('[checkin]')
    const hostname = Dent.SysInfo.hostname(true)
    const ipaddress = (await Dent.SysInfo.ip_private()) || (await Dent.SysInfo.ip_public())
    await this.cinemon.nodes.checkin(this.options.type, hostname, ipaddress)
  }

  private async scan() {
    this.log.debug('[scan-start]')

    await Dent.Throttle.all(
      Object.keys(this.options.mounts)
        .filter((name) => this.options.mounts[name].enabled)
        .map((name) => async () => {
          this.log.debug('[scan-mount-start]', name)

          const mount = this.options.mounts[name]

          try {
            for await (const mountfile of this.storage.files(mount)) {
              this.log.debug(Path.join(mountfile.path, mountfile.name))

              const existing = await this.context.files.get(this.getFileKey(mountfile))

              const transformed = await this.tasks.reduce(
                (previous, task) => previous.then((file) => task.file(file)),
                Promise.resolve(existing || mountfile),
              )

              try {
                await this.update(transformed)
                this.log.debug(Path.join(transformed.path, transformed.name))
              } catch (error) {
                this.log.error(error)
              }
            }
          } catch (error) {
            this.log.error(new BError(mount.name, error))
          }

          this.log.debug('[scan-mount-done]', name)
        }),
    )

    this.log.debug('[scan-done]')
  }

  private async update(file: MountFile): Promise<void> {
    try {
      await this.context.files.update(file, (filedoc) => this.getFileKey(filedoc))
    } catch (error) {
      throw new BError('update-error', error)
    }
  }

  private getFileKey(filedoc: MountFile): string {
    const filename = filedoc.name.replace(/[\.\_\/\-]/g, '')
    const filepath = filedoc.path.replace(/[\.\_\/\-]/g, '')
    return [filedoc.mount.name, filepath, filename].join('-').toLowerCase()
  }
}
