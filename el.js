const { promisify } = require("util")
const fs = require("fs")
const _ = require("lodash")
const path = require("path")

/* global process */
/* eslint-disable no-console */

const installDir = path.dirname(process.argv[1])
const enumsFile = path.join(installDir, "data", "enums.json")

function complete(args) {
    const allEnums = JSON.parse(fs.readFileSync(enumsFile, { encoding: "utf-8" }))
    const setKeys = _.keys(allEnums)
    const setNames = _.map(setKeys, setKey => setKey.split(".")[0])

    const namesToKeys = _.zipObject(setNames, setKeys)

    switch (args.length) {
    case 0:
        return setNames

    case 1: {
        const partialSetName = args[0]
        const matches = _.filter(
            setNames,
            setName => _.startsWith(setName, partialSetName),
        )

        if (matches.length === 1 && matches[0] === partialSetName) {
            const setKey = namesToKeys[partialSetName]

            const { members } = allEnums[setKey]

            return _.map(_.values(members), memberKey => memberKey.split(".")[1])
        }
        return matches
    }

    case 2: {
        const setKey = namesToKeys[args[0]]
        const partialMemberName = args[1]

        const memberNames = _.map(_.values(allEnums[setKey].members),
            memberKey => memberKey.split(".")[1])

        const matches = _.filter(memberNames,
            memberName => _.startsWith(memberName, partialMemberName),
        )

        if (matches.length === 1 && matches[0] === partialMemberName) {
            return []
        }
        return matches
    }

    default:
        return []
    }
}

function main() {
    if (process.stdout.isTTY) {
        colors.enable()
    } else {
    // output is going to a file, disable color markers
        colors.disable()
    }

    const userArgs = parseArgs(process.argv.slice(2), {})

    if (userArgs._[0] && userArgs._[0] === "complete") {
        console.log(_.join(complete(userArgs), " "))
        return;
    }

    const allEnums = JSON.parse(fs.readFileSync("allEnums.json", { encoding: "utf8" }))

    switch (userArgs._.length) {
    case 1: {
        const setArg = userArgs._[0]
        const setIdArg = parseInt(setArg, 10)
        const setNameArg = _.isNaN(setIdArg) ? setArg : undefined
        const { setName, set } = findSet(allEnums, setNameArg, setIdArg)
        if (set) {
            printEnumSet(setName, set)
        } else {
            console.log(`Set '${setArg}' not found.`)
        }
        return
    }
    case 2: {
        const setArg = userArgs._[0]
        const setIdArg = parseInt(setArg, 10)
        const setNameArg = _.isNaN(setIdArg) ? setArg : undefined
        const { setName, set } = findSet(allEnums, setNameArg, setIdArg)

        if (set) {
            const memberArg = userArgs._[1]
            const memberIdArg = parseInt(memberArg, 10)
            const memberNameArg = _.isNaN(memberIdArg) ? memberArg : undefined
            const { memberName, member } = findMember(set, memberNameArg, memberIdArg)

            if (member) {
                printEnumMember(setName, set, memberName, member)
            }
            console.log(`Set '${setName}' found but member with name or id '${memberArg}' not found`)
        } else {
            console.log(`Set '${setArg}' not found.`)
        }
        break
    }
    default:
        break
    }
}

module.exports = { main, complete }