import { Dent } from '../deps.ts'

import { Nodes } from './Nodes.ts'
import { Movies } from './Movies.ts'
import { Series } from './Series.ts'
import { Node } from './Models/Node.ts'
import { MountFiles } from './MountFiles.ts'
import { MountFile } from './Models/MountFile.ts'
import { MediaMovie, MediaSeries } from './Models/Media.ts'

export class DataContext {
  readonly files: MountFiles
  readonly movies: Movies
  readonly nodes: Nodes
  readonly series: Series

  constructor(name: string, store: Dent.DocumentStore) {
    this.files = new MountFiles(store.collection<MountFile>(name, 'mount-file'))
    this.movies = new Movies(store.collection<MediaMovie>(name, 'movie'))
    this.nodes = new Nodes(store.collection<Node>(name, 'node'))
    this.series = new Series(store.collection<MediaSeries>(name, 'series'))
  }
}
