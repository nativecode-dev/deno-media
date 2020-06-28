import { Alo } from '../../../deps.ts'

import { MediaStoreOptions } from '../../MediaStoreOptions.ts'
import { MediaStoreOptionsToken } from '../../MediaStoreOptions.ts'

@Alo.Controller()
export class HomeController {
  constructor(@Alo.Inject(MediaStoreOptionsToken) private readonly options: MediaStoreOptions) {}

  @Alo.Get()
  get() {
    return this.options
  }
}
