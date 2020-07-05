import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/files')
export class FileController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    try {
      return Alo.Content(await this.context.files.all(), 200)
    } catch {
      return Alo.Content([], 404)
    }
  }

  @Alo.Get('/:id')
  async getById(id: string) {
    try {
      const file = await this.context.files.get(id)

      if (file) {
        return Alo.Content({}, 200)
      }

      return Alo.Content({}, 404)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    try {
      const file = await req.body()
      await this.context.files.update(file)
      return Alo.Content({}, 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }
}
