import { Document } from '../../deps.ts'

import { RecordData } from './Types/RecordData.ts'

export interface Media extends Document {
  data: RecordData
}
