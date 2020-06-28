import { IdentifyFileSelections } from './IdentifyFileSelections.ts'

export interface IdentifyFile {
  id: string
  filename: string
  filepath: string
  guessit: any
  mount: string
  selections: IdentifyFileSelections
}
