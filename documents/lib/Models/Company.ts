import { Document } from '../../deps.ts'

import { RecordData } from './Types/RecordData.ts'

export interface Company extends Document {
  data: RecordData
  name: string
}
