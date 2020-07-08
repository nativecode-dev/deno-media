export * as Cinemon from './cinemon/mod.ts'
export * as Storage from './storage-agent/mod.ts'

import * as path from 'https://deno.land/std@0.59.0/path/mod.ts'

import { exists } from 'https://deno.land/std@0.59.0/fs/exists.ts'
import { parse } from 'https://deno.land/std@0.59.0/flags/mod.ts'

import { Dent } from './cinemon/deps.ts'

import * as Cinemon from './cinemon/mod.ts'
import * as Storage from './storage-agent/mod.ts'

interface ProgramArgs {
  _: string[]
}

const ARGS: ProgramArgs = parse(Deno.args) as ProgramArgs

const EXECUTABLES: { [key: string]: { config: any; main: (config: any) => Promise<void> | void } } = {
  cinemon: { config: Cinemon.DefaultCinemonOptions, main: Cinemon.main },
  'storage-agent': { config: Storage.DefaultStorageAgentOptions, main: Storage.main },
}

const CONFIG_DIR = path.join(Deno.cwd(), '.config')

if ((await exists(CONFIG_DIR)) === false) {
  await Deno.mkdir(CONFIG_DIR, { recursive: true })
}

async function configuration(name: string, filename: string): Promise<[string, any]> {
  const defaults = EXECUTABLES[name].config

  if (await exists(filename)) {
    const jsontext = await Deno.readTextFile(filename)
    const json = JSON.parse(jsontext)
    return [filename, Dent.ObjectMerge.merge(defaults, json)]
  }

  const config = Dent.ObjectMerge.merge(defaults)
  return [filename, config]
}

await Promise.all(
  ARGS._.map(async (name) => {
    const executable = EXECUTABLES[name]
    const defaultpath = path.join(Deno.cwd(), '.config', `${name}.json`)
    const paths = [defaultpath, path.join(Deno.cwd(), '.config', `conf.${name}.json`)]

    const fullpath = await paths.reduce<Promise<string>>(async (result, current) => {
      if (await exists(current)) {
        return current
      }
      return result
    }, Promise.resolve(defaultpath))

    const [filename, config] = await configuration(name, fullpath)
    await Deno.writeTextFile(filename, JSON.stringify(config, null, 2))

    console.log('[run]', name)
    return executable.main(config)
  }),
)
