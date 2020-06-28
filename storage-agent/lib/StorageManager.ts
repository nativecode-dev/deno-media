import { Alo, Dent, Path } from '../deps.ts'

import { MountFile } from './MountFile.ts'
import { StorageAgentOptions, StorageAgentOptionsToken, StorageAgentMount } from './StorageAgentOptions.ts'

@Alo.Injectable()
export class StorageManager {
  private readonly log: Dent.Lincoln

  constructor(
    @Alo.Inject(Dent.LoggerType) logger: Dent.Lincoln,
    @Alo.Inject(StorageAgentOptionsToken) private readonly options: StorageAgentOptions,
  ) {
    this.log = logger.extend('storage-manager')
  }

  async *all(mount: StorageAgentMount): AsyncGenerator<MountFile> {
    for await (const entry of this.entries(mount.path, mount)) {
      yield entry
    }
  }

  async *directories(mount: StorageAgentMount): AsyncGenerator<MountFile> {
    for await (const entry of this.entries(mount.path, mount)) {
      if (entry.type === 'directory') {
        yield entry
      }
    }
  }

  async *files(mount: StorageAgentMount): AsyncGenerator<MountFile> {
    for await (const entry of this.entries(mount.path, mount)) {
      if (entry.type === 'file') {
        yield entry
      }
    }
  }

  private async *entries(cwd: string, mount: StorageAgentMount): AsyncGenerator<MountFile> {
    for await (const entry of Deno.readDir(cwd)) {
      const extname = Path.extname(entry.name)
      const ignored = mount.ignore.includes(entry.name)
      const includeAll = mount.allowed.includes('*')
      const includeExt = mount.allowed.includes(extname)

      if ((includeAll === false && includeExt === false && entry.isFile) || ignored) {
        continue
      }

      yield { mount, name: entry.name, path: cwd, type: entry.isDirectory ? 'directory' : 'file' }

      if (entry.isDirectory) {
        const subdir = Path.join(cwd, entry.name)

        for await (const mountfile of this.entries(subdir, mount)) {
          yield mountfile
        }
      }
    }
  }
}
