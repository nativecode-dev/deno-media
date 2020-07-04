import { BError, Dent } from '../deps.ts'

import { MediaMovie } from './Models/Media.ts'

function NODE_KEY(document: Dent.Essentials.DeepPartial<MediaMovie>): string {
  return document.imdb_id!
}

export class Movies {
  constructor(private readonly collection: Dent.DocumentCollection<MediaMovie>) {}

  all() {
    try {
      return this.collection.all()
    } catch (error) {
      throw new BError('all', error)
    }
  }

  async get(imdb_id: string) {
    try {
      return await this.collection.get(imdb_id)
    } catch (error) {
      console.error(new BError(imdb_id, error))
      return null
    }
  }

  async update(media: Dent.Essentials.DeepPartial<MediaMovie>) {
    try {
      return await this.collection.update(media, NODE_KEY)
    } catch (error) {
      throw new BError(media.imdb_id!, error)
    }
  }
}
