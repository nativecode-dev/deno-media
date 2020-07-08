import { Connectors, Dent } from '../deps.ts'
import { Env, assertNotEquals } from '../deps_test.ts'

import { Node } from '../lib/Models/Node.ts'
import { Nodes } from '../lib/Nodes.ts'

const env = new Env({ env: Deno.env.toObject(), prefix: ['test'] })
const envobj = env.toObject()

const DB_NAME = 'test-deno-media'
const HOSTNAME = Deno.env.get('HOST') || 'localhost'

const DEFAULTS: Dent.ConnectorOptions = {
  endpoint: {
    host: 'localhost',
    port: 5984,
    protocol: 'http',
  },
  name: 'couchdb',
}

const store = new Connectors.Couch.CouchStore(Dent.ObjectMerge.merge<Dent.ConnectorOptions>(DEFAULTS, envobj.test.couchdb))

if (await store.exists(DB_NAME)) {
  await store.delete(DB_NAME)
}

await store.create(DB_NAME)

const collection = store.collection<Node>(DB_NAME, 'node')
const client = new Nodes(collection)
const ipaddress = (await Dent.SysInfo.ip_private()) || (await Dent.SysInfo.ip_public()) || '127.0.0.1'

Deno.test('should register node', async () => {
  await client.register('test', HOSTNAME, ipaddress)
})

Deno.test('should get nodes', async () => {
  assertNotEquals(await client.all(), [])
})

Deno.test('should unregister node', async () => {
  await client.unregister('test', HOSTNAME)
})

Deno.test('should cleanup old nodes', async () => {
  await client.cleanup()
})
