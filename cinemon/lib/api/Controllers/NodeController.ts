import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/nodes')
export class NodeController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    return await this.context.nodes.all()
  }

  @Alo.Post('/register')
  async post(@Alo.Req() req: Alo.Request) {
    const { name, hostname, ipaddress } = await req.body()
    const registered = await this.context.nodes.registered(name, hostname)

    if (registered === false) {
      await this.context.nodes.register(name, hostname, ipaddress)
    }

    return { name, hostname, ipaddress }
  }

  @Alo.Put('/checkin')
  async put(@Alo.Req() req: Alo.Request) {
    const { name, hostname, ipaddress } = await req.body()
    const registered = await this.context.nodes.registered(name, hostname)

    if (registered === false) {
      await this.context.nodes.register(name, hostname, ipaddress)
    }

    await this.context.nodes.checkin(name, hostname, ipaddress)

    return { name, hostname, ipaddress }
  }
}
