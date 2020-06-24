import { DocumentCollection, Essentials, ObjectMerge } from '../deps.ts'

import { MediaMovie } from './Models/Media.ts'

function NODE_KEY(document: Essentials.DeepPartial<MediaMovie>): string {
  return [document.type, document.tmdb_id].join('_')
}

export class Movies {
  constructor(private readonly collection: DocumentCollection<MediaMovie>) {}

  async get(id: string) {
    return await this.collection.get(id)
  }

  async update(media: Essentials.DeepPartial<MediaMovie>) {
    const document = ObjectMerge.merge<MediaMovie>(media)
    return await this.collection.update(document, NODE_KEY)
  }
}
