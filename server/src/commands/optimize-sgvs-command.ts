import fs from 'fs/promises'
import path from 'path'
import cp from 'child_process'
import { promisify } from 'util'

const exec = promisify(cp.exec)

export interface OptimizeSvgsCommandOptions {
  input: string
  output: string
  currentColor: boolean
  vue: boolean
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
  const Svgo = await import('svgo')

  await fs.mkdir(options.output, { recursive: true })

  const extraPlugins: any[] = []
  if (options.currentColor) extraPlugins.push(currentColorPlugin)

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
        ...extraPlugins,
      ],
    })

    if (result.modernError) throw result.modernError

    if (options.vue) {
      await fs.writeFile(
        path.join(options.output, filename.replace('.svg', '.vue')),
        `<template>\n${result.data}\n</template>`
      )
    } else {
      await fs.writeFile(path.join(options.output, filename), result.data)
    }
  }

  const { stdout } = await exec(`du -hs ${options.input} ${options.output}`)
  console.log(stdout)
}
