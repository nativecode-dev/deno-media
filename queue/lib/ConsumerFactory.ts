import { connect, AmqpChannel, ConnectorOptions } from '../deps.ts'

import { Envelope } from './Envelope.ts'
import { QueueOptions } from './QueueOptions.ts'

export class ConsumerFactory<T> {
  constructor(private readonly connection: ConnectorOptions, private readonly options: QueueOptions) {}

  async create() {
    const connection = await connect({
      hostname: this.connection.endpoint.host,
      password: this.connection.credentials?.password,
      username: this.connection.credentials?.username,
    })

    const channel = await connection.openChannel()

    await channel.declareQueue(this.options)

    return new Consumer<T>(channel)
  }
}

class Consumer<T> {
  constructor(channel: AmqpChannel) {}
}
