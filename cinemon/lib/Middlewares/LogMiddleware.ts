import { Alo } from '../../deps.ts'

@Alo.Middleware(new RegExp('/(?!favicon)'))
export class LogMiddleware implements Alo.MiddlewareTarget<any> {
  onPreRequest(context: Alo.Context<any>) {
    console.log('[PRE]', context.request.url)
  }

  onPostRequest(context: Alo.Context<any>) {
    console.log('[POST]', context.request.url, { result: context.response.result })
  }
}
