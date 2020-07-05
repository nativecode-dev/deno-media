import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/series')
export class SeriesController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    try {
      const items = await this.context.series.all()
      return Alo.Content(items, 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Get(':imdb_id')
  async getbyId(imdb_id: string) {
    try {
      const series = await this.context.series.get(imdb_id)

      if (series) {
        return Alo.Content(series, 200)
      }

      return Alo.Content({}, 404)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    try {
      const series = await req.body()
      await this.context.series.update(series)
      return Alo.Content({}, 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }
}
