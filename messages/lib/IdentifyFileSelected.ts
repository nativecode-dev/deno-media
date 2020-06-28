import { IdentifyFile } from './IdentifyFile.ts'
import { IdentifyFileSelection } from './IdentifyFileSelection.ts'

export interface IdentifyFileSelected {
  identify_file: IdentifyFile
  selection: IdentifyFileSelection
}
