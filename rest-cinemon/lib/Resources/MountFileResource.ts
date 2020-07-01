import { Dent, Documents } from '../../deps.ts'

import { CinemoneClientOptions } from '../CinemonClientOptions.ts'

export class MountFileResource extends Dent.RestResource<any> {
  constructor(options: CinemoneClientOptions) {
    super(options)
  }

  async update(file: Documents.MountFile) {
    return await this.http_put('files', file)
  }
}
