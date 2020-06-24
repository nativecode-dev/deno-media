import { DocumentCollection, Essentials, ObjectMerge } from '../deps.ts'

import { MediaSeries } from './Models/Media.ts'

function NODE_KEY(document: Essentials.DeepPartial<MediaSeries>): string {
  return [document.type, document.tmdb_id].join('_')
}

export class Series {
  constructor(private readonly collection: DocumentCollection<MediaSeries>) {}

  async get(id: string) {
    return await this.collection.get(id)
  }

  async update(media: Essentials.DeepPartial<MediaSeries>) {
    const document = ObjectMerge.merge<MediaSeries>(media)
    return await this.collection.update(document, NODE_KEY)
  }
}
