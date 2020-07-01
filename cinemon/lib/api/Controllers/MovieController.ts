import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/movies')
export class MovieController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get()
  async get() {
    return await this.context.movies.all()
  }

  @Alo.Get(':imdb_id')
  async getbyId(imdb_id: string) {
    return await this.context.movies.get(imdb_id)
  }

  @Alo.Put()
  async put(@Alo.Req() req: Alo.Request) {
    const movie = await req.body()
    return await this.context.movies.update(movie)
  }
}
