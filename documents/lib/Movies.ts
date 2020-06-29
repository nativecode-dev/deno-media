import { Dent } from '../deps.ts'

import { MediaMovie, MediaType } from './Models/Media.ts'

function NODE_KEY(document: Dent.Essentials.DeepPartial<MediaMovie>): string {
  return [MediaType.movie, document.imdb_id].join('_')
}

export class Movies {
  constructor(private readonly collection: Dent.DocumentCollection<MediaMovie>) {}

  async get(imdb_id: string) {
    try {
      return await this.collection.get(NODE_KEY({ imdb_id }))
    } catch (error) {
      console.log(imdb_id)
      throw error
    }
  }

  async update(media: Dent.Essentials.DeepPartial<MediaMovie>) {
    return await this.collection.update(media, NODE_KEY)
  }
}
