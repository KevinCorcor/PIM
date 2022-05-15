const { Command } = require('commander')
const fs = require('fs')
const path = require('path')
const { version } = require('../package.json')

const cmd = new Command()

cmd
    .version(version, '-v --version')
    .requiredOption('-t --target <path>', 'the path to our target file', (t) => fs.readFileSync(path.join(process.cwd(), t), 'UTF-8'))
    .option('-o --output <path>')
    .option('-s --silent', false)
    .option('--no-prettyPrint', false)

cmd.parse(process.argv)


module.exports = cmd