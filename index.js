#!/usr/bin/env node

const exec = require('sync-exec')
const chalk = require('chalk')
const clear = require('clear')
const ora = require('ora');

const package = process.argv.slice(2)[0]

const info = message => console.log(chalk.green(message))
const warning = message => console.log(chalk.yellow(message))

let install = (package, tool, cache) => {
  let message = `${package}: ${tool}`
  if (cache) message += ' with cache'
  else message += ' without cache'

  const spinner = ora(chalk.yellow('installing ' + message)).start();

  const start = new Date().getTime()
  if (tool === 'yarn') exec(`yarn add ${package} --cache-folder .yarn_cache`, {stdio: [2]})
  else if (tool = 'npm') exec(`npm install ${package} --cache .npm_cache --cache-min 999999999`, {stdio: [2]})
  spinner.stop();

  const end = new Date().getTime()
  info(`${message}: ${(end - start)/1000}s`)
}

let createFolder = (package, tool) => {
  exec(`mkdir test-${package}-${tool}`)
  process.chdir(`test-${package}-${tool}`)
  exec('npm init -y')
}

let deleteFolder = (package, tool) => {
  process.chdir('../')
  exec(`rm -rf test-${package}-${tool}`)
  info('')
}

let cleanUp = () => {
  exec('rm -rf node_modules')
  exec('rm yarn.lock')
  info('')
}

let benchmark = (package, tool) => {
  createFolder(package, tool)

  install (package, tool, false)
  cleanUp();
  install (package, tool, true)

  deleteFolder(package, tool)
}

if (package) {
  clear()
  benchmark(package, 'yarn')
  benchmark(package, 'npm')
} else warning(`
  You forgot to specify package name.

  Example: npm test express

`)
