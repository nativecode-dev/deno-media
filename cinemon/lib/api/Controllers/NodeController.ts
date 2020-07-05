import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/nodes')
export class NodeController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    try {
      const items = await this.context.nodes.all()
      return Alo.Content(items, 200)
    } catch {
      return Alo.Content([], 404)
    }
  }

  @Alo.Get('/:id')
  async getById(@Alo.Param('id') id: string) {
    try {
      const node = await this.context.nodes.get(id)

      if (node) {
        return Alo.Content(node, 200)
      }

      return Alo.Content({}, 404)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Post('/register')
  async post(@Alo.Req() req: Alo.Request) {
    const { name, hostname, ipaddress } = await req.body()
    const registered = await this.context.nodes.registered(name, hostname)

    if (registered === false) {
      await this.context.nodes.register(name, hostname, ipaddress)
    }

    return Alo.Content({ name, hostname, ipaddress }, 200)
  }

  @Alo.Put('/checkin')
  async put(@Alo.Req() req: Alo.Request) {
    const { name, hostname, ipaddress } = await req.body()
    const registered = await this.context.nodes.registered(name, hostname)

    if (registered === false) {
      await this.context.nodes.register(name, hostname, ipaddress)
      return Alo.Content({ name, hostname, ipaddress }, 201)
    }

    await this.context.nodes.checkin(name, hostname, ipaddress)

    return Alo.Content({ name, hostname, ipaddress }, 200)
  }
}
