import { BError, Dent, differenceInDays } from '../deps.ts'

import { Node } from './Models/Node.ts'

function NODE_KEY(src: string | Dent.Essentials.DeepPartial<Node>, hostname?: string): string {
  if (typeof src === 'string') {
    return [src, hostname].join('-')
  }

  return [src.name, hostname || src.machine?.host].join('-')
}

export class Nodes {
  constructor(private readonly collection: Dent.DocumentCollection<Node>) {}

  all(): Promise<Node[]> {
    try {
      return this.collection.all()
    } catch (error) {
      throw new BError('all', error)
    }
  }

  async checkin(name: string, hostname: string, ipaddress: string): Promise<void> {
    try {
      const { host, domain } = this.hostparts(hostname)
      const node = await this.collection.get(NODE_KEY(name, host))

      if (node) {
        const required = { machine: { domain, host, ipaddress }, pulse: new Date() }
        const updated = Dent.ObjectMerge.merge<Node>(node, required)
        await this.collection.update(updated, NODE_KEY)
      }
    } catch (error) {
      throw new BError('checkin', error)
    }
  }

  async get(id: string): Promise<Node | null> {
    try {
      return await this.collection.get(id)
    } catch (error) {
      throw new BError('get', error)
    }
  }

  async register(name: string, hostname: string, ipaddress: string) {
    try {
      const { domain, host } = this.hostparts(hostname)
      const document = { machine: { domain, host, ipaddress }, name, pulse: new Date() }
      await this.collection.update(document, NODE_KEY)
    } catch (error) {
      throw new BError('register', error)
    }
  }

  async registered(name: string, hostname: string): Promise<boolean> {
    try {
      const { host } = this.hostparts(hostname)
      return (await this.collection.get(NODE_KEY(name, host))) !== null
    } catch (error) {
      throw new BError('registered', error)
    }
  }

  async unregister(name: string, hostname: string) {
    try {
      const { host } = this.hostparts(hostname)
      const key = NODE_KEY(name, host)
      const node = await this.collection.get(key)

      if (node) {
        return await this.collection.delete(node._id!, node._rev)
      }
    } catch (error) {
      throw new BError('unregister', error)
    }
  }

  async cleanup(days: number = 5) {
    try {
      const nodes = await this.all()

      const tasks = nodes.map(async (node) => {
        const diffdays = differenceInDays(node.pulse, new Date())

        if (diffdays > days) {
          await this.unregister(node.name, node.machine.host)
        }
      })

      await Promise.all(tasks)
    } catch (error) {
      throw new BError('cleanup', error)
    }
  }

  private hostparts(hostname: string): { host: string; domain: string } {
    return { domain: hostname.split('.').slice(1).join('.'), host: hostname.split('.').slice(0, 1).join('') }
  }
}
