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
      return Alo.Content(await this.context.files.get(id), 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    try {
      const file = await req.body()
      return Alo.Content(await this.context.files.update(file), 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }
}
