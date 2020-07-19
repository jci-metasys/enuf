#!/usr/bin/env node
const parseArgs = require("minimist")
const _ = require("lodash")
const { complete } = require("./el.js")

/* global process */

// The arguments to this script when invoked by el-completion.bash
// [0] /Users/cwelchmi/.nvm/versions/node/v10.15.2/bin/node
// [1] /Users/cwelchmi/repos/enums/el.js
// [2] complete
// [3] el
// [4] att

// So if this is a complete we want to pass slice[4] to complete

const userArgs = parseArgs(process.argv.slice(2), {})

if (userArgs._[0] && userArgs._[0] === "complete") {
    console.log(_.join(complete(userArgs._.slice(2)), " "))
}

