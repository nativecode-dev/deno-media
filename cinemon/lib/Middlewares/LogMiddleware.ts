import { Alo, Dent } from '../../deps.ts'

@Alo.Middleware(new RegExp('/(?!favicon)'))
export class LogMiddleware implements Alo.MiddlewareTarget<any> {
  onPreRequest(context: Alo.Context<any>) {
    console.log(context.request.url)
  }

  onPostRequest(context: Alo.Context<any>) {}
}
