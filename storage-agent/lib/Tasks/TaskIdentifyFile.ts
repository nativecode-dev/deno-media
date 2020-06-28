import { Alo, Dent, Queues } from '../../deps.ts'

import { MountFile } from '../MountFile.ts'
import { StorageAgentTask } from '../StorageAgentTask.ts'

const TaskName = 'task'

export class TaskIdentifyFile implements StorageAgentTask {
  constructor(@Alo.Inject(Queues.RemoteTaskPublisherToken) private readonly publisher: Dent.IPublisher<MountFile>) {}

  async file(file: MountFile): Promise<MountFile> {
    if (file.queued.includes(TaskName) === false) {
      this.publisher.send(file)
      file.queued.push(TaskName)
    }

    return file
  }
}
