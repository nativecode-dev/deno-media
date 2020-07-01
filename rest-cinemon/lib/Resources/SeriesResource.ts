import { Dent, Documents } from '../../deps.ts'

import { CinemoneClientOptions } from '../CinemonClientOptions.ts'

export class SeriesResource extends Dent.RestResource<any> {
  constructor(options: CinemoneClientOptions) {
    super(options)
  }

  async update(series: Documents.MediaSeries) {
    return await this.http_put('series', series)
  }
}
