#!/usr/bin/env node

//
// The cli entrypoint
//

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { fakeScheduleCommand } from './commands/fake-schedule-command.js'
import { fetchScheduleCommand } from './commands/fetch-schedule-command.js'
import { migrateCommand } from './commands/migrate-command.js'
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

cli.command(
  'migrate',
  'Run pending database migrations',
  (yargs) => yargs,
  (args) => migrateCommand(args).catch(errorHandler)
)

cli.command(
  'fake-schedule',
  'Generate a fake schedule for development',
  (yargs) => yargs,
  (args) => fakeScheduleCommand(args).catch(errorHandler)
)

cli.command(
  'fetch-schedule',
  'Fetch schedule information from Notion',
  (yargs) => yargs.option('localFile', { type: 'string' }),
  (args) => fetchScheduleCommand(args).catch(errorHandler)
)

cli.parse()
