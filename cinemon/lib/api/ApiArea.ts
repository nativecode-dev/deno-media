import { Alo } from '../../deps.ts'

import { HomeController } from './Controllers/HomeController.ts'
import { NodeController } from './Controllers/NodeController.ts'
import { MovieController } from './Controllers/MovieController.ts'
import { SeriesController } from './Controllers/SeriesController.ts'

@Alo.Area({
  controllers: [HomeController, MovieController, NodeController, SeriesController],
})
export class ApiArea {}
