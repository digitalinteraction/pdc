#!/usr/bin/env node

//
// The cli entrypoint
//

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { exportScheduleCommand } from './commands/export-schedule-command.js'
import { fakeScheduleCommand } from './commands/fake-schedule-command.js'
import { fetchScheduleCommand } from './commands/fetch-schedule-command.js'
import { logVisitorsCommand } from './commands/log-visitors-command.js'
import { migrateCommand } from './commands/migrate-command.js'
import { optimizeSvgsCommand } from './commands/optimize-sgvs-command.js'
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
      .option('migrate', { type: 'boolean', default: false })
      .option('settings', { type: 'boolean', default: false }),
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
  (yargs) =>
    yargs
      .option('localFile', { type: 'string' })
      .option('only', {
        type: 'array',
        default: [] as any[],
        choices: ['schedule', 'content', 'settings', 'registrations'],
      })
      .option('staticDir', { type: 'string', default: 'static/notion' })
      .option('skipFiles', { type: 'boolean', default: false })
      .option('quiet', { key: 'boolean', default: false }),
  (args) => fetchScheduleCommand(args).catch(errorHandler)
)

cli.command(
  'svg',
  'Optimize SVGs',
  (yargs) =>
    yargs.options({
      input: { type: 'string', default: 'svgs/input' },
      output: { type: 'string', default: 'svgs/output' },
      currentColor: { type: 'boolean', default: false },
      vue: { type: 'boolean', default: false },
    }),
  (args) => optimizeSvgsCommand(args).catch(errorHandler)
)

cli.command(
  'log-visitors',
  'Log the number of visitors as a metric',
  (yargs) => yargs,
  (args) => logVisitorsCommand(args).catch(errorHandler)
)

cli.command(
  'export-schedule [destination]',
  'Export a public static version of the schedule',
  (yargs) =>
    yargs.positional('destination', {
      type: 'string',
      describe: 'Where to put the static files',
      default: 'static/schedule',
    }),
  (args) => exportScheduleCommand(args).catch(errorHandler)
)

cli.parse()
