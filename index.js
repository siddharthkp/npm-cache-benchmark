#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const childProcess = require('child_process');

const results = {
  'npm/npm': { average: 0, runs: [] },
  'npm/npm-cached': { average: 0, runs: [] },
  'npm/shrinkpack': { average: 0, runs: [] },
  'npm/shrinkpack-compressed': { average: 0, runs: [] },
  'yarn/yarn': { average: 0, runs: [] },
  'npm5/npm': { average: 0, runs: [] },
  'npm5/npm-cached': { average: 0, runs: [] },
  'npm5/shrinkpack': { average: 0, runs: [] },
  'npm5/shrinkpack-compressed': { average: 0, runs: [] }
};

function average (list) {
  return list.reduce((total, value) => total + value, 0) / list.length;
}

function spawn(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = childProcess.spawn(cmd, args, options);
    // proc.stdout.setEncoding('utf8');
    // proc.stdout.on('data', data => process.stdout.write(chalk.grey(data.toString())));
    // proc.stderr.setEncoding('utf8');
    // proc.stderr.on('data', data => process.stdout.write(chalk.grey(data.toString())));
    proc.on('close', code => code !== 0 ? reject() : resolve());
  });
}

async function clean(dirPath) {
  await spawn('npm', ['cache', 'clean']);
  await spawn('yarn', ['cache', 'clean']);
  if (dirPath.includes('-cached') == false) {
    await spawn('rm', ['-rf', path.join(dirPath, 'node_cache')]);
  }
  await spawn('rm', ['-rf', path.join(dirPath, 'node_modules')]);
}

async function runBenchmark(installer, directory) {
  const key = `${installer}/${directory}`;
  const dirPath = path.resolve(directory);

  await clean(dirPath);
  const start = new Date().getTime();
  await spawn(installer, ['install'], { cwd: dirPath });
  const end = new Date().getTime();
  await clean(dirPath);

  const time = (end - start) / 1000;
  const result = results[key];
  result.runs.push(time);
  result.average = average(result.runs);
  console.log(`${key}: ${time}s (average ${result.average}s over ${result.runs.length} runs)`);
  return time;
}

async function runAll() {
  try {
    const sampleSize = 5;
    for (let i = 1; i <= sampleSize; i++) {
      console.log(chalk.underline(`Run ${i}`));
      await runBenchmark('npm', 'npm');
      await runBenchmark('npm', 'npm-cached');
      await runBenchmark('npm', 'shrinkpack');
      await runBenchmark('npm', 'shrinkpack-compressed');
      await runBenchmark('yarn', 'yarn');
      await runBenchmark('npm5', 'npm');
      await runBenchmark('npm5', 'npm-cached');
      await runBenchmark('npm5', 'shrinkpack');
      await runBenchmark('npm5', 'shrinkpack-compressed');
      console.log('');
    }
  } catch (err) {
    console.error(chalk.red(err));
    process.exit(1);
  }
}

runAll();
