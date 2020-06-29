import { Dent } from '../../deps.ts'

import { RecordData } from './Types/RecordData.ts'

export interface Company extends Dent.Document {
  data: RecordData
  name: string
}
