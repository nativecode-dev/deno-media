import { Dent } from '../deps.ts'

import { MediaSeries, MediaType } from './Models/Media.ts'

function NODE_KEY(document: Dent.Essentials.DeepPartial<MediaSeries>): string {
  return [MediaType.series, document.imdb_id].join('_')
}

export class Series {
  constructor(private readonly collection: Dent.DocumentCollection<MediaSeries>) {}

  async get(imdb_id: string) {
    try {
      return await this.collection.get(NODE_KEY({ imdb_id }))
    } catch (error) {
      console.log(imdb_id)
      throw error
    }
  }

  async update(media: Dent.Essentials.DeepPartial<MediaSeries>) {
    return await this.collection.update(media, NODE_KEY)
  }
}
