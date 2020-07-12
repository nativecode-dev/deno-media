import { Dent, Path } from '../deps.ts'

import { MediaStoreConnections, DefaultMediaStoreConnections } from './MediaStoreConnections.ts'

export interface CinemonOptions {
  connections: MediaStoreConnections
  database: { name: string }
  hosting: Dent.ConnectorOptions
  schedules: { [key: string]: string }
  type: string
  workdir: string
}

const workdir = Path.dirname(Path.fromFileUrl(import.meta.url))

export const DefaultCinemonOptions: CinemonOptions = {
  connections: DefaultMediaStoreConnections,
  database: { name: 'cinemon' },
  hosting: {
    endpoint: {
      host: Dent.SysInfo.hostname(),
      port: 3000,
    },
    name: 'cinemon',
  },
  schedules: {
    unmonitor: '5m',
    sync: '10m',
  },
  type: 'cinemon',
  workdir: Path.join(workdir, '../../'),
}

export const CinemonOptionsToken: symbol = Symbol('CinemonOptions')
