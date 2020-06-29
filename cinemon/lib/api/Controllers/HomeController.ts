import { Alo } from '../../../deps.ts'

@Alo.Controller()
export class HomeController {
  constructor() {}

  @Alo.Get()
  get() {
    return { name: 'cinemon' }
  }
}
