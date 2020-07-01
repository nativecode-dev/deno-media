import { BError, Dent } from '../deps.ts'

import { MediaSeries, MediaType } from './Models/Media.ts'

function NODE_KEY(document: Dent.Essentials.DeepPartial<MediaSeries>): string {
  return document.imdb_id!
}

export class Series {
  constructor(private readonly collection: Dent.DocumentCollection<MediaSeries>) {}

  all() {
    return this.collection.all()
  }

  async get(imdb_id: string) {
    try {
      return await this.collection.get(imdb_id)
    } catch (error) {
      throw new BError(imdb_id, error)
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
