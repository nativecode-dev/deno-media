import { Dent, Documents } from '../../deps.ts'

import { CinemoneClientOptions } from '../CinemonClientOptions.ts'

export class MovieResource extends Dent.RestResource<any> {
  constructor(options: CinemoneClientOptions) {
    super(options)
  }

  async update(movie: Documents.MediaMovie) {
    return await this.http_put('movies', movie)
  }
}
