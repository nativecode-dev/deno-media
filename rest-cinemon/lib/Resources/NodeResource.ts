import { Dent } from '../../deps.ts'

import { CinemoneClientOptions } from '../CinemonClientOptions.ts'

export class NodeResource extends Dent.RestResource<any> {
  constructor(options: CinemoneClientOptions) {
    super(options)
  }

  async checkin(name: string, hostname: string, ipaddress: string) {
    await this.http_put('nodes/checkin', { name, hostname, ipaddress })
  }

  async register(name: string, hostname: string, ipaddress: string) {
    await this.http_post('nodes/register', { name, hostname, ipaddress })
  }
}
