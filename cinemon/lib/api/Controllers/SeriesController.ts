import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/series')
export class SeriesController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    return await this.context.series.all()
  }

  @Alo.Get(':imdb_id')
  async getbyId(imdb_id: string) {
    return await this.context.series.get(imdb_id)
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    const series = await req.body()
    return await this.context.series.update(series)
  }
}
