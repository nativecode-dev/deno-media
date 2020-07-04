import { BError, Dent } from '../deps.ts'

import { MediaSeries } from './Models/Media.ts'

function NODE_KEY(document: Dent.Essentials.DeepPartial<MediaSeries>): string {
  return document.imdb_id!
}

export class Series {
  constructor(private readonly collection: Dent.DocumentCollection<MediaSeries>) {}

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

  async update(media: Dent.Essentials.DeepPartial<MediaSeries>) {
    try {
      return await this.collection.update(media, NODE_KEY)
    } catch (error) {
      throw new BError(media.imdb_id!, error)
    }
  }
}
