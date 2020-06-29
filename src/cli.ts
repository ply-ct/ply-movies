#!/usr/bin/env node

import * as process from 'process';
import * as program from 'commander';
import { Server } from './server';

let server = new Server();

const startCmd = new program.Command()
    .name('start')
    .option('-p, --port <port>', 'listen on this port')
    .option('-i, --indent <indent>', 'format JSON response with this number of spaces')
    .action(options => {
        server.start(options);
    });
const stopCmd = new program.Command()
    .name('stop')
    .action(() => {
        server.stop();
    });

program
  .addCommand(startCmd)
  .addCommand(stopCmd)
  .parse(process.argv);
