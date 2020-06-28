import { Dent, RxJs } from '../deps.ts'

export abstract class SubjectConsumer<T> extends RxJs.Subject<Dent.EnvelopeQueue<T>> {
  constructor(private readonly queue: Dent.IConsumer<T>) {
    super()
  }

  async start() {
    for await (const envelope of this.generator()) {
      this.next(envelope)
    }
  }

  private async *generator(): AsyncGenerator<Dent.EnvelopeQueue<T>> {
    let envelope: Dent.EnvelopeQueue<T>

    while ((envelope = await this.queue.consume())) {
      yield envelope
    }
  }
}
