import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/files')
export class FileController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    return await this.context.files.all()
  }

  @Alo.Get('/:id')
  async getById(id: string) {
    return await this.context.files.get(id)
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    const file = await req.body()
    return await this.context.files.update(file)
  }
}
