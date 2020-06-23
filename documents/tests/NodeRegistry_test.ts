import { CouchStore } from '../deps.ts'
import { Env, assertEquals } from '../deps_test.ts'

import { Node } from '../lib/Models/Node.ts'
import { NodeRegistry } from '../lib/NodeRegistry.ts'

const env = new Env({ env: Deno.env.toObject(), prefix: ['test'] })
const envobj = env.toObject()

const DB_NAME = 'test-deno-media'

const store = new CouchStore(envobj.test.couchdb)

if (await store.exists(DB_NAME)) {
  await store.delete(DB_NAME)
}

await store.create(DB_NAME)

const collection = await store.collection<Node>(DB_NAME, 'node')
const client = new NodeRegistry(collection)

Deno.test('should register node', async () => {
  const hostname = Deno.hostname()
  const response = await client.register('test', hostname, hostname)
  console.log(response)
})

Deno.test('should unregister node', async () => {
  await client.unregister('test', Deno.hostname())
})

Deno.test('should cleanup old nodes', async () => {
  await client.cleanup()
})
