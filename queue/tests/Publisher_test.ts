import { ConnectorOptions, ObjectMerge } from '../deps.ts'
import { Env } from '../test_deps.ts'

import { ConsumerFactory } from '../lib/ConsumerFactory.ts'
import { PublisherFactory } from '../lib/PublisherFactory.ts'

const env = new Env({ env: Deno.env.toObject(), prefix: ['test'] })
const envobj = env.toObject()

const CONNECTION = ObjectMerge.merge<ConnectorOptions>(
  {
    arguments: { vhost: '/' },
    endpoint: {
      host: 'localhost',
      port: 5672,
    },
    name: 'rabbitmq',
  },
  envobj.test.rabbitmq,
)

const QUEUE = {
  autoDelete: true,
  durable: false,
  subject: 'test-queue',
}

interface TestMessage {
  test: string
}

Deno.test('should publish to queue', async () => {
  const factory = new PublisherFactory<TestMessage>(CONNECTION, QUEUE)
  const publisher = await factory.create()
  await publisher.send({ test: 'message' })

  await factory.close()
})

Deno.test('should consume message', async () => {
  const factory = new ConsumerFactory<TestMessage>(CONNECTION, QUEUE)
  const consumer = await factory.create()
  const envelope = await consumer.consume()
  await consumer.acknowledge(envelope)

  await factory.close()
})
