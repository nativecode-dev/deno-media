import { Alo } from '../../deps.ts'

@Alo.Middleware(new RegExp('/(?!favicon)'))
export class LogMiddleware implements Alo.MiddlewareTarget<any> {
  onPreRequest(context: Alo.Context<any>) {}

  onPostRequest(context: Alo.Context<any>) {}
}
