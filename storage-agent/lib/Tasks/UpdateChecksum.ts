import { Checksum, Path } from '../../deps.ts'

import { MountFile } from '../MountFile.ts'
import { StorageAgentTask } from '../StorageAgentTask.ts'

export class UpdateChecksum implements StorageAgentTask {
  async file(file: MountFile): Promise<MountFile> {
    const hash = Checksum.createHash('md5')
    const filename = Path.join(file.path, file.name)

    const reader = await Deno.open(filename)

    try {
      for await (const bytes of Deno.iter(reader)) {
        hash.update(bytes)
      }

      file.checksum = hash.toString('hex')

      return file
    } finally {
      reader.close()
    }
  }
}
