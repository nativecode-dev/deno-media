import { Alo, Dent } from '../../deps.ts'

@Alo.Middleware(new RegExp('/(?!favicon)'))
export class LogMiddleware implements Alo.MiddlewareTarget<any> {
  constructor(@Alo.Inject(Dent.LoggerType) logger: Dent.Lincoln) {
    console.log('logger', logger)
  }

  onPreRequest(context: Alo.Context<any>) {}

  onPostRequest(context: Alo.Context<any>) {}
}
