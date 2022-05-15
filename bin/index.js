#!/usr/bin/env node
const cmd = require('./cli')
const pim = require('../src/index')

const {
    output,
    target,
    silent,
    prettyPrint,
} = cmd.opts()

const options = {
    output,
    target,
    silent,
    prettyPrint,
}

try {
    pim(options)
} catch(err) {
    console.error('PIM failed to execute', err)
}