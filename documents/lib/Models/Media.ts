import { Dent } from '../../deps.ts'

import { RecordData } from './Types/RecordData.ts'

export enum MediaType {
  movie = 'MOVIE',
  series = 'SERIES',
}

export interface Media extends Dent.Document {
  data: RecordData
  imdb_id: string
  title: string
  type: MediaType
  year?: number
}

export interface MediaMovie extends Media {}

export interface MediaSeries extends Media {}
