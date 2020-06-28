import { Alo, Dent } from '../deps.ts'

import { MountFile } from './MountFile.ts'
import { DatabaseNameToken, DocumentStoreToken } from './Tokens.ts'

@Alo.Injectable()
export class StorageAgentContext {
  readonly files: Dent.DocumentCollection<MountFile>

  constructor(@Alo.Inject(DatabaseNameToken) dbname: string, @Alo.Inject(DocumentStoreToken) store: Dent.DocumentStore) {
    this.files = store.collection(dbname, 'files')
  }
}
