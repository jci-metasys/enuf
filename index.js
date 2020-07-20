#!/usr/bin/env node
const parseArgs = require("minimist")
const _ = require("lodash")
const { complete, main } = require("./enul.js")

/* global process */

// Assuming this is the input enul attr<tab><tab>

// The arguments to this script when invoked by enul-completion.bash
// [0] /Users/cwelchmi/.nvm/versions/node/v10.15.2/bin/node
// [1] /Users/cwelchmi/repos/enums/enul.js
// [2] complete
// [4] enul
// [5] attr


const userArgs = parseArgs(process.argv.slice(2), {})

if (userArgs._[0] && userArgs._[0] === "complete") {
    console.log(_.join(complete(userArgs._.slice(2)), " "))
} else {
    main(userArgs._)
}