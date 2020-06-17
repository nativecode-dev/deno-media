import { connect, AmqpChannel, ConnectorOptions, QueueDeclareOk } from '../deps.ts'

import { Envelope } from './Envelope.ts'
import { QueueOptions } from './QueueOptions.ts'

export class PublisherFactory<T> {
  constructor(private readonly connection: ConnectorOptions, private readonly options: QueueOptions) {
    if (this.options.queue === undefined) {
      this.options.queue = this.options.subject
    }
  }

  async create(): Promise<Publisher<T>> {
    const connection = await connect({
      hostname: this.connection.endpoint.host,
      password: this.connection.credentials?.password,
      username: this.connection.credentials?.username,
      port: this.connection.endpoint.port,
      vhost: this.connection.arguments?.vhost,
    })

    const channel = await connection.openChannel()
    const queue = await channel.declareQueue(this.options)

    return new Publisher<T>(this.options, channel, queue)
  }
}

class Publisher<T> {
  private readonly encoder = new TextEncoder()

  constructor(private readonly options: QueueOptions, private readonly channel: AmqpChannel, queue: QueueDeclareOk) {}

  async send(message: T): Promise<void> {
    const envelope: Envelope<T> = { body: message, subject: this.options.subject }

    await this.channel.publish(
      { routingKey: this.options.queue },
      { contentType: 'application/json' },
      this.encoder.encode(JSON.stringify(envelope)),
    )
  }
}
