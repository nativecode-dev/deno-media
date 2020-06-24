import { ConnectorOptions, CouchStore, ObjectMerge } from '../deps.ts'
import { Env, getIP } from '../deps_test.ts'

import { Node } from '../lib/Models/Node.ts'
import { NodeRegistry } from '../lib/NodeRegistry.ts'

const env = new Env({ env: Deno.env.toObject(), prefix: ['test'] })
const envobj = env.toObject()

const DB_NAME = 'test-deno-media'
const HOSTNAME = Deno.env.get('HOST') || 'localhost'

const DEFAULTS: ConnectorOptions = {
  endpoint: {
    host: 'localhost',
    port: 5984,
    protocol: 'http',
  },
  name: 'couchdb',
}

const store = new CouchStore(ObjectMerge.merge<ConnectorOptions>(DEFAULTS, envobj.test.couchdb))

if (await store.exists(DB_NAME)) {
  await store.delete(DB_NAME)
}

await store.create(DB_NAME)

const collection = await store.collection<Node>(DB_NAME, 'node')
const client = new NodeRegistry(collection)

Deno.test('should register node', async () => {
  const ipaddress = await getIP()
  await client.register('test', HOSTNAME, ipaddress)
})

Deno.test('should unregister node', async () => {
  await client.unregister('test', HOSTNAME)
})

Deno.test('should cleanup old nodes', async () => {
  await client.cleanup()
})
