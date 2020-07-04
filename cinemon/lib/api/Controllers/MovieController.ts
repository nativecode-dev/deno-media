import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/movies')
export class MovieController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    try {
      return Alo.Content(await this.context.movies.all(), 200)
    } catch {
      return Alo.Content([], 404)
    }
  }

  @Alo.Get(':imdb_id')
  async getbyId(imdb_id: string) {
    try {
      return Alo.Content(await this.context.movies.get(imdb_id), 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    try {
      const movie = await req.body()
      return Alo.Content(await this.context.movies.update(movie), 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }
}
