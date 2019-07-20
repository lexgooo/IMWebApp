#! /usr/bin/env node
const env = process.argv[2]
const script = process.argv[3]
const shell = require('shelljs')

shell.exec(`cd ${env} && npm run ${script}`)