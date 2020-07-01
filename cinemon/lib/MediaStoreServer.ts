import { Alo, Dent, Documents } from '../deps.ts'

import { ApiArea } from './api/ApiArea.ts'
import { MediaStore } from './MediaStore.ts'
import { LogMiddleware } from './Middlewares/LogMiddleware.ts'
import { MediaStoreOptions, MediaStoreOptionsToken } from './MediaStoreOptions.ts'

@Alo.Injectable()
export class MediaStoreServer {
  protected readonly application: Alo.App<any>

  private readonly log: Dent.Lincoln

  constructor(
    @Alo.Inject(MediaStoreOptionsToken) private readonly options: MediaStoreOptions,
    @Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext,
    @Alo.Inject(Dent.Scheduler) private readonly scheduler: Dent.Scheduler,
    @Alo.Inject(MediaStore) private readonly store: MediaStore,
    @Alo.Inject(Dent.LoggerType) logger: Dent.Lincoln,
  ) {
    this.application = new Alo.App({ areas: [ApiArea], middlewares: [LogMiddleware] })
    this.log = logger.extend('server')
  }

  async run(): Promise<void> {
    this.application.error((context: Alo.Context<any>, error: Error) => {
      context.response.result = Alo.Content('This page unprocessed error', (error as Alo.HttpError).httpCode || 500)
      context.response.setImmediately()
      this.log.error(error, context)
    })

    await this.createJobs()
    await this.application.listen({ port: this.options.hosting.endpoint.port || 3000 })
  }

  private async createJobs() {
    this.scheduler.fromSchedule({
      command: async () => {
        await Promise.all([this.syncRadarr(), this.syncSonarr()])
      },
      name: 'sync',
      schedule: this.options.schedules.sync,
      type: Dent.ScheduleType.every,
    })
  }

  private async syncRadarr() {
    try {
      const response = await this.store.radarr.movie.list()

      const movies = response
        .filter((x) => x.imdbId)
        .filter((x) => x.imdbId !== '')
        .filter((x) => x.year !== 0)

      this.log.debug('[radarr-start]', movies.length)

      const tasks = movies.map((movie) => {
        return async () => {
          try {
            const radarr = await this.context.movies.get(movie.imdbId)

            if (radarr !== null) {
              return
            }

            await this.context.movies.update({
              data: { radarr: movie },
              imdb_id: movie.imdbId,
              title: movie.title,
              tmdb_id: movie.tmdbId,
              type: Documents.MediaType.movie,
              year: movie.year,
            })
          } catch (error) {
            this.log.error(error, movie.title)
          }
        }
      })

      await Dent.Throttle.all(tasks)

      this.log.debug('[radarr-done]')
    } catch (error) {
      this.log.error(error)
    }
  }

  private async syncSonarr() {
    try {
      const response = await this.store.sonarr.series.list()

      const shows = response
        .filter((x) => x.imdbId)
        .filter((x) => x.imdbId !== '')
        .filter((x) => x.year !== 0)

      this.log.debug('[sonarr-start]', shows.length)

      const tasks = shows.map((series) => {
        return async () => {
          try {
            const show = await this.context.movies.get(series.imdbId)

            if (show !== null) {
              return
            }

            await this.context.series.update({
              data: { sonarr: series },
              imdb_id: series.imdbId,
              title: series.title,
              type: Documents.MediaType.series,
              year: series.year,
            })
          } catch (error) {
            this.log.error(error, series.title)
          }
        }
      })

      await Dent.Throttle.all(tasks)

      this.log.debug('[sonarr-done]')
    } catch (error) {
      this.log.debug(error)
    }
  }
}
