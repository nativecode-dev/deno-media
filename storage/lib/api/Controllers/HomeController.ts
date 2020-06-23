import { Alo } from '../../../deps.ts'

import { MediaStore } from '../../MediaStore.ts'
import { MediaStoreOptions } from '../../MediaStoreOptions.ts'
import { MediaStoreOptionsToken } from '../../MediaStoreOptions.ts'

@Alo.Controller()
export class HomeController {
  constructor(
    @Alo.Inject(MediaStoreOptionsToken) private readonly options: MediaStoreOptions,
    @Alo.Inject(MediaStore) private readonly store: MediaStore,
  ) {}

  @Alo.Get()
  async get() {
    return await this.store.radarr.movie.list()
  }
}
