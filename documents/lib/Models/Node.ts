import { Dent } from '../../deps.ts'

export interface Machine {
  domain: string
  host: string
  ipaddress: string
}

export interface Node extends Dent.Document {
  machine: Machine
  name: string
  pulse: Date
}
