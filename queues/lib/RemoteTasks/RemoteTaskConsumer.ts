import { Dent, Messages } from '../../deps.ts'

import { SubjectConsumer } from '../SubjectConsumer.ts'

export class RemoteTaskConsumer extends SubjectConsumer<Messages.RemoteTaskCompleted> {
  constructor(queue: Dent.IConsumer<Messages.RemoteTaskCompleted>) {
    super(queue)
  }
}

export const RemoteTaskConsumerToken: symbol = Symbol('RemoteTaskConsumer')
