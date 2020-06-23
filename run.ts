import * as path from 'https://deno.land/std@0.58.0/path/mod.ts'

import { exists } from 'https://deno.land/std@0.58.0/fs/exists.ts'
import { parse } from 'https://deno.land/std@0.58.0/flags/mod.ts'

import { Dent } from './media-store/deps.ts'

import * as mediastore from './media-store/mod.ts'
import { MediaStoreOptions } from './media-store/mod.ts'

interface ProgramArgs {
  _: string[]
}

const ARGS: ProgramArgs = parse(Deno.args) as ProgramArgs

const EXECUTABLES: { [key: string]: (config: MediaStoreOptions) => Promise<void> | void } = {
  store: mediastore.main,
}

const CONFIG_DIR = path.join(Deno.cwd(), '.config')

if ((await exists(CONFIG_DIR)) === false) {
  await Deno.mkdir(CONFIG_DIR, { recursive: true })
}

async function configuration(filename: string): Promise<[string, MediaStoreOptions]> {
  const defaults = mediastore.DefaultMediaStoreOptions

  if (await exists(filename)) {
    const jsontext = await Deno.readTextFile(filename)
    const json = JSON.parse(jsontext)
    return [filename, Dent.ObjectMerge.merge<MediaStoreOptions>({}, defaults, json)]
  }

  return [filename, Dent.ObjectMerge.merge<MediaStoreOptions>({}, defaults)]
}

const [filename, config] = await configuration(path.join(Deno.cwd(), '.config', 'conf.media-store.json'))
await Deno.writeTextFile(filename, JSON.stringify(config, null, 2))

await Promise.all(
  ARGS._.map((name) => {
    console.log('running', name)
    return EXECUTABLES[name](config)
  }),
)
