import { MountFile } from '../MountFile.ts'
import { StorageAgentTask } from '../StorageAgentTask.ts'

export class UpdateGuessit implements StorageAgentTask {
  async file(file: MountFile): Promise<MountFile> {
    if (file.guessit === undefined) {
      try {
        const response = await fetch(`https://guessit.nativecode.com/?filename=${file.name}`)
        file.guessit = await response.json()
      } catch (error) {
        console.log(error, file)
      }
    }

    return file
  }
}
