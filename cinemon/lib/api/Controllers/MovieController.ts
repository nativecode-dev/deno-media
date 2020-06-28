import { Alo, Documents } from '../../../deps.ts'

@Alo.Controller('/movie')
export class MovieController {
  constructor(@Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext) {}

  @Alo.Get('/:id')
  async get(@Alo.Param('id') id: string) {
    return await this.context.movies.get(id)
  }
}
