#!/usr/bin/env node

//
// The cli entrypoint
//

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { serveCommand } from './commands/serve-command.js'

// commands ...

const cli = yargs(hideBin(process.argv))
  .help()
  .demandCommand(1, 'A command is required')
  .recommendCommands()

function errorHandler(error: any) {
  console.error('A fatal error occured')
  console.error(error)
  process.exit(1)
}

cli.command(
  'serve',
  'Run the http server',
  (yargs) =>
    yargs
      .option('port', { type: 'number', default: 3000 })
      .option('migrate', { type: 'boolean', default: false }),
  (args) => serveCommand(args).catch(errorHandler)
)

cli.parse()
