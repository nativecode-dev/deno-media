import { DocumentStore } from '../deps.ts'

import { Nodes } from './Nodes.ts'
import { Movies } from './Movies.ts'
import { Series } from './Series.ts'
import { Node } from './Models/Node.ts'
import { MediaMovie, MediaSeries } from './Models/Media.ts'

export class DataContext {
  readonly movies: Movies
  readonly nodes: Nodes
  readonly series: Series

  constructor(name: string, store: DocumentStore) {
    this.movies = new Movies(store.collection<MediaMovie>(name, 'movies'))
    this.nodes = new Nodes(store.collection<Node>(name, 'nodes'))
    this.series = new Series(store.collection<MediaSeries>(name, 'series'))
  }
}
