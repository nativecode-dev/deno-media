import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/series')
export class SeriesController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    try {
      return Alo.Content(await this.context.series.all(), 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Get(':imdb_id')
  async getbyId(imdb_id: string) {
    try {
      return Alo.Content(await this.context.series.get(imdb_id), 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    try {
      const series = await req.body()
      return Alo.Content(await this.context.series.update(series), 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }
}
