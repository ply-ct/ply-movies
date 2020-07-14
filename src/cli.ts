#!/usr/bin/env node

import * as process from 'process';
import * as program from 'commander';
import { Server } from './server';
import { version } from './version';

const server = new Server();

const startCmd = new program.Command()
    .name('start')
    .option('-p, --port <port>', 'listen on this port (3000)', parseInt)
    .option('-i, --indent <indent>', 'format JSON response with this number of spaces (0)', parseInt)
    .option('-f, --file <file>', 'where to store writeable movies JSON file (movies.json)')
    .option('-r, --readonly', 'flag to disallow POST, PUT, PATCH and DELETE requests')
    .action(options => {
        server.start(options);
    });
const stopCmd = new program.Command()
    .name('stop')
    .option('-p, --port <port>', 'request shutdown via this port')
    .action(() => {
        server.stop();
    });
const verCmd = new program.Command()
    .name('version')
    .action(() => {
        console.log(`ply-movies ${version}`);
    });

program
  .addCommand(startCmd)
  .addCommand(stopCmd)
  .addCommand(verCmd)
  .parse(process.argv);
