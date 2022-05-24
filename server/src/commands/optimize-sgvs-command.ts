import Svgo from 'svgo'
import fs from 'fs/promises'
import path from 'path'
import cp from 'child_process'
import { promisify } from 'util'

const exec = promisify(cp.exec)

export interface OptimizeSvgsCommandOptions {
  input: string
  output: string
}

const currentColorPlugin = {
  name: 'customColor',
  type: 'visitor',
  fn() {
    return {
      element: {
        enter(node: any) {
          if (node.attributes.fill) {
            node.attributes.fill = 'currentColor'
          }
        },
      },
    }
  },
}

export async function optimizeSvgsCommand(options: OptimizeSvgsCommandOptions) {
  await fs.mkdir(options.output, { recursive: true })

  const files = await fs.readdir(options.input)

  for (const filename of files) {
    if (!filename.endsWith('.svg')) continue

    const file = path.join(options.input, filename)
    const data = await fs.readFile(file, 'utf8')
    const result = Svgo.optimize(data, {
      multipass: true,
      path: file,
      floatPrecision: 2,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
        currentColorPlugin as any,
      ],
    })

    if (result.modernError) throw result.modernError

    await fs.writeFile(path.join(options.output, filename), result.data)
  }

  const { stdout } = await exec(`du -hs ${options.input} ${options.output}`)
  console.log(stdout)
}
