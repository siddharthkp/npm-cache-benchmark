#!/usr/bin/env node

const chalk = require('chalk');
const exec = require('sync-exec');
const path = require('path');

const info = message => console.log(chalk.green(message))
const warning = message => console.log(chalk.yellow(message))

const benchmarksByName = {
  'npm': () => exec('npm install --loglevel=http', {
    cwd: path.resolve('./npm'),
    stdio: [2]
  }),
  'npm-cached': () => exec('npm install --loglevel=http', {
    cwd: path.resolve('./npm-cached'),
    stdio: [2]
  }),
  'shrinkpack': () => exec('npm install --loglevel=http', {
    cwd: path.resolve('./shrinkpack'),
    stdio: [2]
  }),
  'shrinkpack-compressed': () => exec('npm install --loglevel=http', {
    cwd: path.resolve('./shrinkpack-compressed'),
    stdio: [2]
  }),
  'yarn': () => exec(`yarn install`, {
    cwd: path.resolve('./yarn'),
    stdio: [2]
  }),
  'npm5': () => exec('npm5 install --loglevel=http', {
    cwd: path.resolve('./npm'),
    stdio: [2]
  }),
  'npm5-cached': () => exec('npm5 install --loglevel=http', {
    cwd: path.resolve('./npm-cached'),
    stdio: [2]
  }),
  'npm5-shrinkpack': () => exec('npm5 install --loglevel=http', {
    cwd: path.resolve('./shrinkpack'),
    stdio: [2]
  }),
  'npm5-shrinkpack-compressed': () => exec('npm5 install --loglevel=http', {
    cwd: path.resolve('./shrinkpack-compressed'),
    stdio: [2]
  }),
};

const runBenchmark = toolName => {
  const benchmark = benchmarksByName[toolName];
  const start = new Date().getTime()
  benchmark();
  const end = new Date().getTime();
  info(`${toolName}: ${(end - start)/1000}s`);

  // clean up
  exec(`rm -rf ./${toolName}/node_modules`);
  if (toolName.search(/^(npm-cached|npm5-cached)$/) !== -1) {
    exec(`rm -rf ./${toolName}/node_cache`);
  }
}

runBenchmark('npm');
runBenchmark('npm-cached');
runBenchmark('shrinkpack');
runBenchmark('shrinkpack-compressed');

runBenchmark('yarn');

runBenchmark('npm5');
runBenchmark('npm5-cached');
runBenchmark('npm5-shrinkpack');
runBenchmark('npm5-shrinkpack-compressed');
