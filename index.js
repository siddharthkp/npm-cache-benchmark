const path = require('path');
const childProcess = require('child_process');

const results = {
  'npm/npm': { average: 0, name: 'npm 4.x', runs: [] },
  'npm/npm-cached': { average: 0, name: 'npm 4.x (cached)', runs: [] },
  'npm/shrinkpack': { average: 0, name: 'npm 4.x (shrinkpacked)', runs: [] },
  'npm/shrinkpack-compressed': { average: 0, name: 'npm 4.x (shrinkpacked, compressed)', runs: [] },
  'yarn/yarn': { average: 0, name: 'yarn', runs: [] },
  'yarn/yarn-offline': { average: 0, name: 'yarn --offline', runs: [] },
  'npm5/npm': { average: 0, name: 'npm 5.x', runs: [] },
  'npm5/npm-cached': { average: 0, name: 'npm 5.x (cached)', runs: [] },
  'npm5/shrinkpack': { average: 0, name: 'npm 5.x (shrinkpacked)', runs: [] },
  'npm5/shrinkpack-compressed': { average: 0, name: 'npm 5.x (shrinkpacked, compressed)', runs: [] },
  'pnpm/pnpm': { average: 0, name: 'pnpm', runs: [] },
  'pnpm/pnpm-cached': { average: 0, name: 'pnpm (cached)', runs: [] },
  'pnpm/pnpm-offline': { average: 0, name: 'pnpm --offline', runs: [] },
};

const cacheClean = {
  pnpm: function(dirPath) {
    spawn('rm', ['-rf', path.join(dirPath, '.pnpm-registry')]);
    spawn('rm', ['-rf', path.join(dirPath, '.pnpm-store')]);
  }
}

const cacheCleanArgs = ['cache', 'clean'];

try {
  runAll();
} catch (err) {
  onError(err);
}

// implementation

function runAll() {
  const sampleSize = 5;
  for (let i = 1; i <= sampleSize; i++) {
    console.log(`Run ${i}`);
    runBenchmark('npm', ['install'], 'npm');
    runBenchmark('npm', ['install'], 'npm-cached');
    runBenchmark('npm', ['install'], 'shrinkpack');
    runBenchmark('npm', ['install'], 'shrinkpack-compressed');
    runBenchmark('yarn', ['install'], 'yarn');
    runBenchmark('yarn', ['install', '--offline'], 'yarn-offline');
    runBenchmark('npm5', ['install'], 'npm');
    runBenchmark('npm5', ['install'], 'npm-cached');
    runBenchmark('npm5', ['install'], 'shrinkpack');
    runBenchmark('npm5', ['install'], 'shrinkpack-compressed');
    runBenchmark('pnpm', ['install'], 'pnpm');
    runBenchmark('pnpm', ['install'], 'pnpm-cached');
    runBenchmark('pnpm', ['install'], 'pnpm-offline');
    console.log('');
  }
}

function runBenchmark(installer, args, directory) {
  const key = `${installer}/${directory}`;
  const dirPath = path.resolve(directory);

  clean(installer, dirPath);
  const start = new Date().getTime();
  spawn(installer, args, dirPath);
  const end = new Date().getTime();
  verify(dirPath);
  clean(installer, dirPath);

  const time = (end - start) / 1000;
  const result = results[key];
  result.runs.push(time);
  result.average = average(result.runs);

  console.log(`${result.name}: ${time.toFixed(2)}s (average ${result.average.toFixed(2)}s)`);
}

function spawn(cmd, args, cwd) {
  const shell = childProcess.spawnSync(cmd, args, {
    cwd: cwd || process.cwd(),
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  const stdout = shell.output[1];
  const stderr = shell.output[2];
  shell.status !== 0 && onError(stderr);
}

function clean(installer, dirPath) {
  if (dirPath.includes('-cached') === false) {
    let cacheCleaner = cacheClean[installer];
    if (!cacheCleaner) {
      const args = installer === 'npm5' ? cacheCleanArgs.concat('--force') : cacheCleanArgs;
      cacheCleaner = _ => spawn(installer, args, dirPath);
    }

    cacheCleaner(dirPath);  
  }

  if (dirPath.includes('-offline') === false) {
    spawn('rm', ['-rf', path.join(dirPath, 'npm-packages-offline-cache')]);
  }

  spawn('rm', ['-rf', path.join(dirPath, 'node_modules')]);
}

function verify(dirPath) {
  spawn('node', ['./verify.js'], dirPath);
}

function average(list) {
  return list.reduce((total, value) => total + value, 0) / list.length;
}

function onError(err) {
  console.error(err);
  process.exit(1);
}
