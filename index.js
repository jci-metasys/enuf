#!/usr/bin/env node
const parseArgs = require("minimist")
const _ = require("lodash")
const { search } = require("./enul-search")
const { complete } = require("./enul-complete.js")

/* global process */

// Assuming this is the input `enul search attr<tab><tab>`

// The arguments to this script when invoked by enul-completion.bash
// [0] /Users/cwelchmi/.nvm/versions/node/v10.15.2/bin/node
// [1] /Users/cwelchmi/repos/enums/enul.js
// [2] complete
// [3] {cursor word position}
// [4] enul
// [5] search
// [6] attr


const userArgs = parseArgs(process.argv.slice(2), {})

// const fs = require("fs")

// const enums = JSON.parse(fs.readFileSync("./data/enums.json"))
// fs.writeFileSync("./data/enum-names.txt", _.join(_.map(_.keys(enums), key => key.split(".")[0]), " "))
// fs.writeFileSync("./data/enum-ids.text", _.join(_.map(_.keys(enums), key => key.split(".")[1]), " "))


//console.error(userArgs)

const command = userArgs._[0]

switch (command) {
    case "complete": {
        const completeArgs = _.concat(userArgs._.slice(1,2), userArgs._.slice(3))
        console.log(complete(completeArgs), " ")
        break
    }
    case "search":
        search(userArgs._.slice(1))
        break

    case "help":
    default:
        console.log("Help coming soon")
        break
}
