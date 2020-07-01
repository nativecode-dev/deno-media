import { Dent } from '../deps.ts'

import { NodeResource } from './Resources/NodeResource.ts'
import { MovieResource } from './Resources/MovieResource.ts'
import { SeriesResource } from './Resources/SeriesResource.ts'
import { CinemoneClientOptions } from './CinemonClientOptions.ts'
import { MountFileResource } from './Resources/MountFileResource.ts'

export class CinemonClient {
  readonly files: MountFileResource
  readonly movies: MovieResource
  readonly nodes: NodeResource
  readonly series: SeriesResource

  constructor(options: Dent.Essentials.DeepPartial<CinemoneClientOptions>) {
    const opts = Dent.ObjectMerge.merge<CinemoneClientOptions>(options)
    this.files = new MountFileResource(opts)
    this.movies = new MovieResource(opts)
    this.nodes = new NodeResource(opts)
    this.series = new SeriesResource(opts)
  }
}
