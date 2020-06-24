import { Alo } from '../../deps.ts'

import { HomeController } from './Controllers/HomeController.ts'
import { MovieController } from './Controllers/MovieController.ts'

@Alo.Area({ controllers: [HomeController, MovieController] })
export class ApiArea {}
