import { Alo, Dent } from '../deps.ts'

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
    @Alo.InjectAll(StorageAgentTaskToken) private readonly tasks: StorageAgentTask[],
  ) {
    this.log = logger.extend('storage-agent')
  }

  async start() {
    this.scheduler.fromSchedule({ command: () => this.scan(), name: 'scan', schedule: '1s', type: Dent.ScheduleType.every })
  }

  private async scan() {
    this.log.debug('[scan-start]')

    await Object.keys(this.options.mounts)
      .filter((name) => this.options.mounts[name].enabled)
      .reduce<Promise<void>>(async (previous, name) => {
        this.log.debug('[scan-mount-start]', name)

        const mount = this.options.mounts[name]

        await previous

        for await (const mountfile of this.storage.files(mount)) {
          const transformed = await this.tasks.reduce(
            (previous, task) => previous.then((file) => task.file(file)),
            Promise.resolve(mountfile),
          )

          try {
            await this.update(transformed)
          } catch (error) {
            this.log.error(error)
          }
        }

        this.log.debug('[scan-mount-done]', name)
      }, Promise.resolve())

    this.log.debug('[scan-done]')
  }

  private async update(file: MountFile): Promise<void> {
    await this.context.files.update(file, (filedoc) => this.getFileKey(filedoc))
  }

  private getFileKey(filedoc: MountFile): string {
    const filename = filedoc.name.replace(/[\.\_\/\-]/g, '')
    const filepath = filedoc.path.replace(/[\.\_\/\-]/g, '')
    return [filedoc.mount.name, filepath, filename].join('').toLowerCase()
  }
}