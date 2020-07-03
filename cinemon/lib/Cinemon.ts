import { Alo, Dent, Documents } from '../deps.ts'

import { ApiArea } from './api/ApiArea.ts'
import { MediaStore } from './MediaStore.ts'
import { LogMiddleware } from './Middlewares/LogMiddleware.ts'
import { CinemonOptions, CinemonOptionsToken } from './CinemonOptions.ts'

@Alo.Injectable()
export class Cinemon {
  private readonly log: Dent.Lincoln

  protected readonly application: Alo.App<any>

  constructor(
    @Alo.Inject(CinemonOptionsToken) private readonly options: CinemonOptions,
    @Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext,
    @Alo.Inject(Dent.Scheduler) private readonly scheduler: Dent.Scheduler,
    @Alo.Inject(MediaStore) private readonly store: MediaStore,
    @Alo.Inject(Dent.LoggerType) logger: Dent.Lincoln,
  ) {
    this.application = new Alo.App({ areas: [ApiArea], middlewares: [LogMiddleware] })
    this.log = logger.extend('server')
  }

  async run(): Promise<void> {
    try {
      this.application.error((context: Alo.Context<any>, error: Error) => {
        context.response.result = Alo.Content('This page unprocessed error', (error as Alo.HttpError).httpCode || 500)
        context.response.setImmediately()
        this.log.error(error, context)
      })

      await this.createJobs()
      await this.application.listen({ port: this.options.hosting.endpoint.port || 3000 })
    } catch (error) {
      this.log.error(error)
    }
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

    this.scheduler.fromSchedule({
      command: async () => {
        await Promise.all([this.syncRadarr(true), this.syncSonarr(true)])
      },
      name: 'sync',
      schedule: '12am',
      type: Dent.ScheduleType.daily,
    })
  }

  private async syncRadarr(resync: boolean = false) {
    const log = this.log.extend('radarr')

    try {
      const response = await this.store.radarr.movie.list()

      const movies = response
        .filter((x) => x.imdbId)
        .filter((x) => x.imdbId !== '')
        .filter((x) => x.year !== 0)

      log.debug('[radarr-start]', { count: movies.length })

      const tasks = movies.map((movie) => {
        return async () => {
          try {
            const radarr = await this.context.movies.get(movie.imdbId)

            if (radarr !== null && resync == false) {
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

            log.info(movie.title)
          } catch (error) {
            log.error(error, movie.title)
          }
        }
      })

      await Dent.Throttle.all(tasks)
    } catch (error) {
      log.error(error)
    }

    log.debug('[radarr-done]')
  }

  private async syncSonarr(resync: boolean = false) {
    const log = this.log.extend('sonarr')

    try {
      const response = await this.store.sonarr.series.list()

      const shows = response
        .filter((x) => x.imdbId)
        .filter((x) => x.imdbId !== '')
        .filter((x) => x.year !== 0)

      log.debug('[sonarr-start]', { content: shows.length })

      const tasks = shows.map((series) => {
        return async () => {
          try {
            const show = await this.context.series.get(series.imdbId)

            if (show !== null && resync == false) {
              return
            }

            await this.context.series.update({
              data: { sonarr: series },
              imdb_id: series.imdbId,
              title: series.title,
              type: Documents.MediaType.series,
              year: series.year,
            })

            log.info(series.title)
          } catch (error) {
            log.error(error, series.title)
          }
        }
      })

      await Dent.Throttle.all(tasks)
    } catch (error) {
      log.debug(error)
    }

    log.debug('[sonarr-done]')
  }
}
