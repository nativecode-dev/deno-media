import { Alo, BError, Checksum, Dent, Documents, Path, exists } from '../deps.ts'

import { StorageAgentMount, StorageAgentOptions, StorageAgentOptionsToken } from './StorageAgentOptions.ts'

@Alo.Injectable()
export class StorageManager {
  private readonly log: Dent.Lincoln

  constructor(
    @Alo.Inject(Dent.LoggerType) logger: Dent.Lincoln,
    @Alo.Inject(StorageAgentOptionsToken) private readonly options: StorageAgentOptions,
  ) {
    this.log = logger.extend('storage-manager')
  }

  async *all(mount: StorageAgentMount): AsyncGenerator<Documents.MountFile> {
    for await (const entry of this.entries(mount.path, mount)) {
      yield entry
    }
  }

  async *directories(mount: StorageAgentMount): AsyncGenerator<Documents.MountFile> {
    for await (const entry of this.entries(mount.path, mount)) {
      if (entry.type === 'directory') {
        yield entry
      }
    }
  }

  async *files(mount: StorageAgentMount): AsyncGenerator<Documents.MountFile> {
    for await (const entry of this.entries(mount.path, mount)) {
      if (entry.type === 'file') {
        yield entry
      }
    }
  }

  private async *entries(cwd: string, mount: StorageAgentMount): AsyncGenerator<Documents.MountFile> {
    if ((await exists(cwd)) === false) {
      this.log.debug('path does not exist', { cwd, mount })
      return
    }

    for await (const entry of Deno.readDir(cwd)) {
      try {
        const extname = Path.extname(entry.name)
        const ignored = mount.ignore.includes(entry.name)
        const includeAll = mount.allowed.includes('*')
        const includeExt = mount.allowed.includes(extname)

        if ((includeAll === false && includeExt === false && entry.isFile) || ignored) {
          continue
        }

        if (entry.isDirectory) {
          const subdir = Path.join(cwd, entry.name)

          for await (const mountfile of this.entries(subdir, mount)) {
            yield mountfile
          }
        }

        if (entry.isFile) {
          const filename = Path.join(cwd, entry.name)
          const checksum = await this.checksum(filename)

          yield {
            checksum,
            files: [{ data: {}, name: entry.name, path: cwd }],
            mount: { host: this.options.hostname, name: mount.name, path: mount.path },
            type: entry.isDirectory ? 'directory' : 'file',
          }
        }
      } catch (error) {
        this.log.error(error)
        continue
      }
    }
  }

  private async checksum(filename: string): Promise<string> {
    const hash = Checksum.createHash('md5')
    const reader = await Deno.open(filename)

    try {
      for await (const bytes of Deno.iter(reader)) {
        hash.update(bytes)
      }

      return hash.toString('hex')
    } finally {
      reader.close()
    }
  }
}
