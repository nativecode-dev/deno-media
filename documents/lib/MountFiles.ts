import { BError, Dent } from '../deps.ts'

import { MountFile } from './Models/MountFile.ts'

function NODE_KEY(document: Dent.Essentials.DeepPartial<MountFile>): string {
  return document.checksum!
}

export class MountFiles {
  constructor(private readonly collection: Dent.DocumentCollection<MountFile>) {}

  all() {
    try {
      return this.collection.all()
    } catch (error) {
      throw new BError('all', error)
    }
  }

  async get(id: string) {
    try {
      return await this.collection.get(id)
    } catch (error) {
      throw new BError(id, error)
    }
  }

  async update(file: Dent.Essentials.DeepPartial<MountFile>) {
    try {
      return await this.collection.update(file, NODE_KEY)
    } catch (error) {
      throw new BError(file.checksum!, error)
    }
  }
}
