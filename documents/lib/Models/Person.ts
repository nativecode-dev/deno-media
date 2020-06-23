import { Document } from '../../deps.ts'

import { GenderType } from './Types/GenderType.ts'
import { RecordData } from './Types/RecordData.ts'

export interface Person extends Document {
  data: RecordData
  dob: string | undefined
  gender: GenderType
}
