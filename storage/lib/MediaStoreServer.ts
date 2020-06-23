import { Alo } from '../deps.ts'

import { ApiArea } from './api/ApiArea.ts'
import { MediaStoreOptions, MediaStoreOptionsToken } from './MediaStoreOptions.ts'

@Alo.Injectable()
export class MediaStoreServer {
  protected readonly application: Alo.App<any>

  constructor(@Alo.Inject(MediaStoreOptionsToken) private readonly options: MediaStoreOptions) {
    this.application = new Alo.App({ areas: [ApiArea] })
  }

  async run(): Promise<void> {
    const options = { port: this.options.hosting.endpoint.port || 3000 }
    await this.application.listen(options)
  }
}
