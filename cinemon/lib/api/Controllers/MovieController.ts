import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/movies')
export class MovieController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    try {
      const items = await this.context.movies.all()
      return Alo.Content(items, 200)
    } catch {
      return Alo.Content([], 404)
    }
  }

  @Alo.Get(':imdb_id')
  async getbyId(imdb_id: string) {
    try {
      const movie = await this.context.movies.get(imdb_id)
      if (movie) {
        return Alo.Content(movie, 200)
      }

      return Alo.Content({}, 404)
    } catch {
      return Alo.Content({}, 404)
    }
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    try {
      const movie = await req.body()
      await this.context.movies.update(movie)
      return Alo.Content({}, 200)
    } catch {
      return Alo.Content({}, 404)
    }
  }
}
