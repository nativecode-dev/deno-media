import { Alo } from '../../deps.ts'

import { HomeController } from './Controllers/HomeController.ts'
import { NodeController } from './Controllers/NodeController.ts'

@Alo.Area({ controllers: [HomeController, NodeController] })
export class ApiArea {}
