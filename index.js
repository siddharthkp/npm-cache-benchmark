#!/usr/bin/env node

const chalk = require('chalk');
const exec = require('sync-exec');
const path = require('path');

const info = message => console.log(chalk.green(message))
const warning = message => console.log(chalk.yellow(message))

let benchmark = (tool) => {
  let message = tool;
  const start = new Date().getTime()

  if (tool === 'npm') {
    exec('npm install --loglevel=http', {
      cwd: path.resolve('./npm'),
      stdio: [2]
    });
  } else if (tool === 'npm-cached') {
    exec('npm install --loglevel=http', {
      cwd: path.resolve('./npm-cached'),
      stdio: [2]
    });
  } else if (tool === 'shrinkpack') {
    exec('npm install --loglevel=http', {
      cwd: path.resolve('./shrinkpack'),
      stdio: [2]
    });
  } else if (tool === 'shrinkpack-compressed') {
    exec('npm install --loglevel=http', {
      cwd: path.resolve('./shrinkpack-compressed'),
      stdio: [2]
    });
  } else if (tool === 'yarn') {
    exec(`yarn install`, {
      cwd: path.resolve('./yarn'),
      stdio: [2]
    });
  }

  const end = new Date().getTime();
  info(`${tool}: ${(end - start)/1000}s`);

  // clean up
  exec(`rm -rf ./${tool}/node_modules`);
  if (tool !== 'npm-cached') {
    exec(`rm -rf ./${tool}/node_cache`);
  }
}

benchmark('npm');
benchmark('npm-cached');
benchmark('shrinkpack');
benchmark('shrinkpack-compressed');
benchmark('yarn');
