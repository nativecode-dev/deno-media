import { Alo, Dent, Documents } from '../deps.ts'

import { ApiArea } from './api/ApiArea.ts'
import { MediaStore } from './MediaStore.ts'
import { MediaStoreOptions, MediaStoreOptionsToken } from './MediaStoreOptions.ts'

@Alo.Injectable()
export class MediaStoreServer {
  protected readonly application: Alo.App<any>

  private readonly hostname = Deno.env.get('HOST') || 'localhost'
  private readonly log: Dent.Lincoln

  constructor(
    @Alo.Inject(MediaStoreOptionsToken) private readonly options: MediaStoreOptions,
    @Alo.Inject(Documents.DataContext) private readonly context: Documents.DataContext,
    @Alo.Inject(Dent.Scheduler) private readonly scheduler: Dent.Scheduler,
    @Alo.Inject(MediaStore) private readonly store: MediaStore,
    @Alo.Inject(Dent.LoggerType) logger: Dent.Lincoln,
  ) {
    this.application = new Alo.App({ areas: [ApiArea] })
    this.log = logger.extend('server')
  }

  async run(): Promise<void> {
    await this.createJobs()
    await this.application.listen({ port: this.options.hosting.endpoint.port || 3000 })
  }

  private async createJobs() {
    await this.heartbeat()

    this.scheduler.fromSchedule({
      command: () => this.heartbeat(),
      name: 'heartbeat',
      schedule: '1m',
      type: Dent.ScheduleType.every,
    })

    this.scheduler.fromSchedule({
      command: async () => {
        await Promise.all([this.syncRadarr(), this.syncSonarr()])
      },
      name: 'sync',
      schedule: '00 00',
      type: Dent.ScheduleType.hourly,
    })
  }

  private async heartbeat(): Promise<void> {
    const name = 'media-store'

    try {
      const registered = await this.context.nodes.registered(name, this.hostname)

      if (registered === false) {
        await this.context.nodes.register(name, this.hostname, this.hostname)
      } else {
        await this.context.nodes.checkin(name, this.hostname)
      }

      await this.context.nodes.cleanup(1)
      this.log.debug('[heartbeat]', name, this.hostname)
    } catch (error) {
      this.log.error('[heartbeat]', name, this.hostname, error)
    }
  }

  private async syncRadarr() {
    try {
      const response = await this.store.radarr.movie.list()

      const movies = response
        .filter((x) => x.imdbId)
        .filter((x) => x.imdbId !== '')
        .filter((x) => x.year !== 0)

      this.log.debug('[radarr]', movies.length)

      const tasks = movies.map((movie) => {
        return async () => {
          try {
            const radarr = await this.context.movies.get(movie.imdbId)

            if (radarr !== null) {
              return
            }

            await this.context.movies.update({
              data: movie,
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

      this.log.debug('[radarr]', 'completed')
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

      this.log.debug('[sonarr]', shows.length)

      const tasks = shows.map((series) => {
        return async () => {
          try {
            const show = await this.context.movies.get(series.imdbId)

            if (show !== null) {
              return
            }

            await this.context.series.update({
              data: series,
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

      this.log.debug('[sonarr]', 'completed')
    } catch (error) {
      this.log.debug(error)
    }
  }
}
