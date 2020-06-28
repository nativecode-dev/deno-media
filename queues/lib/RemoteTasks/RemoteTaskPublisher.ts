import { Dent, Messages } from '../../deps.ts'

export class RemoteTasPublisher {
  constructor(private readonly queue: Dent.IPublisher<Messages.RemoteTask>) {}

  publish(message: Messages.RemoteTask) {
    return this.queue.send(message)
  }
}

export const RemoteTaskPublisherToken: symbol = Symbol('RemoteTasPublisher')
