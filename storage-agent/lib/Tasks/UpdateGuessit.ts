import { Documents } from '../../deps.ts'

import { StorageAgentTask } from '../StorageAgentTask.ts'

export class UpdateGuessit implements StorageAgentTask {
  async file(files: Documents.MountFileInstance[]): Promise<Documents.MountFileInstance[]> {
    return await Promise.all(
      files.map(async (file) => {
        if (file.data === undefined) {
          try {
            const response = await fetch(`https://guessit.nativecode.com/?filename=${file.name}`)

            if (response.ok === false) {
              throw new Error(response.statusText)
            }

            file.data.guessit = await response.json()
          } catch (error) {
            console.log(error, file)
          }
        }

        return file
      }),
    )
  }
}
