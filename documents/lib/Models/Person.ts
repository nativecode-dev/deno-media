import { Dent } from '../../deps.ts'

import { GenderType } from './Types/GenderType.ts'
import { RecordData } from './Types/RecordData.ts'
import { ExternalPersonId } from './Types/ExternalPersonId.ts'

export interface Person extends Dent.Document {
  data: RecordData
  dob: string | undefined
  external_ids: ExternalPersonId
  fullname: string
  gender: GenderType
  tmdb_id: number
}
