import { ConnectorOptions, ObjectMerge } from '../deps.ts'
import { Env } from '../test_deps.ts'

import { PublisherFactory } from '../lib/PublisherFactory.ts'

const env = new Env({ env: Deno.env.toObject(), prefix: ['test'] })
const envobj = env.toObject()

const DEFAULTS = ObjectMerge.merge<ConnectorOptions>(
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

Deno.test('should publish to queue', async () => {
  const factory = new PublisherFactory<{ test: string }>(DEFAULTS, { durable: false, subject: 'test-queue' })
  const publisher = await factory.create()
  await publisher.send({ test: 'message' })
})
