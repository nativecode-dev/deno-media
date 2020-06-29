import { Dent } from '../deps.ts'

import { NodeResource } from './Resources/NodeResource.ts'
import { CinemoneClientOptions } from './CinemonClientOptions.ts'

export class CinemonClient {
  readonly nodes: NodeResource

  constructor(options: Dent.Essentials.DeepPartial<CinemoneClientOptions>) {
    const opts = Dent.ObjectMerge.merge<CinemoneClientOptions>(options)
    this.nodes = new NodeResource(opts)
  }
}
