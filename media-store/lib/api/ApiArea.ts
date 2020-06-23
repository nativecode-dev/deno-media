import { Alo } from '../../deps.ts'

import { HomeController } from './Controllers/HomeController.ts'

@Alo.Area({ controllers: [HomeController] })
export class ApiArea {}
