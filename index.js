#!/usr/bin/env node

const chalk = require('chalk');
const exec = require('sync-exec');
const path = require('path');

const info = message => console.log(chalk.green(message))
const warning = message => console.log(chalk.yellow(message))

const directoriesByToolName = {
  'npm': path.resolve('./npm'),
  'npm-cached': path.resolve('./npm-cached'),
  'shrinkpack': path.resolve('./shrinkpack'),
  'shrinkpack-compressed': path.resolve('./shrinkpack-compressed'),
  'yarn': path.resolve('./yarn'),
  'npm5': path.resolve('./npm'),
  'npm5-cached': path.resolve('./npm-cached'),
  'npm5-shrinkpack': path.resolve('./shrinkpack'),
  'npm5-shrinkpack-compressed': path.resolve('./shrinkpack-compressed'),
};

const runnersByToolName = {
  'npm': () => exec('npm install', {
    cwd: directoriesByToolName['npm'],
    stdio: [2]
  }),
  'npm-cached': () => exec('npm install', {
    cwd: directoriesByToolName['npm-cached'],
    stdio: [2]
  }),
  'shrinkpack': () => exec('npm install', {
    cwd: directoriesByToolName['shrinkpack'],
    stdio: [2]
  }),
  'shrinkpack-compressed': () => exec('npm install', {
    cwd: directoriesByToolName['shrinkpack-compressed'],
    stdio: [2]
  }),
  'yarn': () => exec(`yarn install`, {
    cwd: directoriesByToolName['yarn'],
    stdio: [2]
  }),
  'npm5': () => exec('npm5 install', {
    cwd: directoriesByToolName['npm5'],
    stdio: [2]
  }),
  'npm5-cached': () => exec('npm5 install', {
    cwd: directoriesByToolName['npm5-cached'],
    stdio: [2]
  }),
  'npm5-shrinkpack': () => exec('npm5 install', {
    cwd: directoriesByToolName['npm5-shrinkpack'],
    stdio: [2]
  }),
  'npm5-shrinkpack-compressed': () => exec('npm5 install', {
    cwd: directoriesByToolName['npm5-shrinkpack-compressed'],
    stdio: [2]
  }),
};

const runBenchmark = toolName => {
  const directory = directoriesByToolName[toolName]
  const run = runnersByToolName[toolName];
  const cacheDir = path.join(directory, 'node_cache');
  const installDir = path.join(directory, 'node_modules');

  const start = new Date().getTime()
  run();
  const end = new Date().getTime();

  const timeInSecs = (end - start) / 1000;
  info(`${toolName}: ${timeInSecs}s`);

  if (toolName.search(/^(npm-cached|npm5-cached)$/) !== -1) {
    exec(`rm -rf ${cacheDir}`);
  }

  exec(`rm -rf ${installDir}`);
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
