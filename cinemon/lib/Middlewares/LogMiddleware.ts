import { Alo, Dent } from '../../deps.ts'

@Alo.Middleware(new RegExp('/(?!favicon)'))
export class LogMiddleware implements Alo.MiddlewareTarget<any> {
  onPreRequest(context: Alo.Context<any>) {
    console.log(context.request.method, context.request.url, context.request.headers)
  }

  onPostRequest(context: Alo.Context<any>) {}
}
