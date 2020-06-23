import { Document } from '../../deps.ts'

export interface Machine {
  hostname: string
  ipaddress: string
}

export interface Node extends Document {
  machine: Machine
  name: string
  pulse: Date
}
