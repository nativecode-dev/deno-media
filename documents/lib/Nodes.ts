import { DocumentCollection, Essentials, differenceInDays } from '../deps.ts'

import { Node } from './Models/Node.ts'
import { assertEquals } from '../deps_test.ts'

function NODE_KEY(src: string | Essentials.DeepPartial<Node>, hostname?: string): string {
  if (typeof src === 'string') {
    return [src, hostname].join('_')
  }

  return [src.name, hostname || src.machine?.hostname].join('_')
}

export class Nodes {
  constructor(private readonly collection: DocumentCollection<Node>) {}

  async checkin(name: string, hostname: string): Promise<void> {
    const node = await this.collection.get(NODE_KEY(name, hostname))

    if (node) {
      node.pulse = new Date()
      await this.collection.update(node, NODE_KEY)
    }
  }

  async register(name: string, hostname: string, ipaddress: string) {
    const document = { machine: { hostname, ipaddress }, name, pulse: new Date() }
    const response = await this.collection.update(document, NODE_KEY)
    assertEquals(response.machine.hostname, hostname)
    assertEquals(response.name, name)
  }

  async registered(name: string, hostname: string): Promise<boolean> {
    return (await this.collection.get(NODE_KEY(name, hostname))) !== null
  }

  async unregister(name: string, hostname: string) {
    const key = NODE_KEY(name, hostname)
    const node = await this.collection.get(key)

    if (node) {
      return await this.collection.delete(node._id!, node._rev)
    }
  }

  async cleanup(days: number = 5) {
    const nodes = await this.collection.all()

    const tasks = nodes.map(async (node) => {
      const diffdays = differenceInDays(node.pulse, new Date())

      if (diffdays > days) {
        await this.unregister(node.name, node.machine.hostname)
      }
    })

    await Promise.all(tasks)
  }
}