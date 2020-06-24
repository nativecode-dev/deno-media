import { Document } from '../../deps.ts'

import { RecordData } from './Types/RecordData.ts'

export enum MediaType {
  movie = 'MOVIE',
  series = 'SERIES',
}

export interface Media extends Document {
  data: RecordData
  tmdb_id: number
  title: string
  type: MediaType
  year?: number
}

export interface MediaMovie extends Media {}

export interface MediaSeries extends Media {}
